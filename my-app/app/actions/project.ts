"use server"

import { revalidatePath } from "next/cache";
import { db } from "../lib/db/drizzle";
import { projectsTable, adaTable, promotionsTable, commentsTable } from "../lib/db/schema";
import { eq, desc, isNotNull } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { headers } from "next/dist/server/request/headers";
import { auth } from "../lib/auth";
import type { ProjectWithRelations, ProjectDetail } from "@/app/types";

// ==================== HELPER ====================

function generateSlug(text: string): string {
    return text
        .toLowerCase()                      // minuscules
        .normalize("NFD")                   // décompose les accents
        .replace(/[\u0300-\u036f]/g, "")    // enlève les accents
        .replace(/[^a-z0-9]+/g, "-")        // remplace caractères spéciaux par -
        .replace(/^-+|-+$/g, "");           // enlève les - au début/fin
}

// ==================== MUTATIONS ====================

export async function addProject(formData: FormData) {

    //  1. Récupérer la session de l'utilisateur connecté
    const session = await auth.api.getSession({
        headers: await headers()
    });

    //  2. Vérifier que l'utilisateur est connecté
    if (!session) {
        throw new Error("Vous devez être connecté pour créer un projet");
    }
    //  3. Récupérer les données du formulaire
    const name = formData.get("name") as string;
    const githubLink = formData.get("github_url") as string;
    const demoLink = formData.get("demo_url") as string;
    const promoId = formData.get("promoId") as string;
    const adaProjectId = formData.get("adaProjectId") as string;

    if (!name || !githubLink || !demoLink || !promoId || !adaProjectId) {
        throw new Error("Tous les champs sont obligatoires");
    }

    await db.insert(projectsTable).values({
        name,
        slug: generateSlug(name),
        github_url: githubLink,
        demo_url: demoLink,
        promotion_id: Number(promoId),
        ada_project_id: Number(adaProjectId),
        user_id: session.user.id, // ← Associer le projet à l'utilisateur
        // ✅ published_at absent → NULL par défaut
    });

    revalidatePath("/");
}



export async function publishProject(projectId: number) {
    await db
        .update(projectsTable)
        .set({ published_at: new Date() })
        .where(eq(projectsTable.id, projectId));

    revalidatePath("/");
}

export async function deleteProject(projectId: number) {
    await db.delete(projectsTable).where(eq(projectsTable.id, projectId));
    revalidatePath("/");
}

// ==================== QUERIES ====================

// ✅ PUBLIC : uniquement les projets publiés
export async function getPublishedProjects() {
    return await db
        .select()
        .from(projectsTable)
        .leftJoin(promotionsTable, eq(promotionsTable.id, projectsTable.promotion_id))
        .leftJoin(adaTable, eq(adaTable.id, projectsTable.ada_project_id))
        .where(isNotNull(projectsTable.published_at))
        .orderBy(desc(projectsTable.published_at));
}

// ✅ ADMIN : tous les projets
export async function getAllProjects(): Promise<ProjectWithRelations[]> {
  const result = await db.execute(
    sql`
      SELECT 
        p.*,
        
        -- Infos promotion
        json_build_object(
          'id', prom.id,
          'name', prom.name
        ) as promotion,
        
        -- Infos ada_project
        json_build_object(
          'id', ada.id,
          'name', ada.name
        ) as ada_project,
        
        -- ✅ Nombre de commentaires
        COUNT(c.id) as comments_count,
        
        -- ✅ Commentaires groupés (pour la page détail)
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'message', c.message,
              'created_at', c.created_at,
              'user', json_build_object(
                'id', u.id,
                'name', u.name,
                'image', u.image
              )
            )
            ORDER BY c.created_at DESC
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as comments
        
      FROM students_projects p
      LEFT JOIN promotions prom ON prom.id = p.promotion_id
      LEFT JOIN ada_projects ada ON ada.id = p.ada_project_id
      LEFT JOIN comments c ON c.project_id = p.id
      LEFT JOIN "user" u ON u.id = c.user_id
      
      GROUP BY p.id, prom.id, prom.name, ada.id, ada.name
      ORDER BY p.published_at DESC NULLS LAST
    `
  );

  return result.rows as ProjectWithRelations[];
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
    const result = await db.execute(
      sql`
      SELECT 
        p.*,
        
        -- Infos promotion
        json_build_object(
          'id', prom.id,
          'name', prom.name
        ) as promotion,
        
        -- Infos ada_project
        json_build_object(
          'id', ada.id,
          'name', ada.name
        ) as ada_project,
        
        -- ✅ Commentaires groupés (pour la page détail)
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'message', c.message,
              'created_at', c.created_at,
              'user', json_build_object(
                'id', u.id,
                'name', u.name,
                'image', u.image,
                'isBanished', u."isBanished"
              )
            )
            ORDER BY c.created_at DESC
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as comments
        
      FROM students_projects p
      LEFT JOIN promotions prom ON prom.id = p.promotion_id
      LEFT JOIN ada_projects ada ON ada.id = p.ada_project_id
      LEFT JOIN comments c ON c.project_id = p.id
      LEFT JOIN "user" u ON u.id = c.user_id
      WHERE p.slug = ${slug}
      
      GROUP BY p.id, prom.id, prom.name, ada.id, ada.name
    `
    )
        
    console.log("voir result ", result.rows[0]);
    return (result.rows[0] as ProjectDetail) || null
}

export async function getPromotions() {
    return await db.select().from(promotionsTable);
}

export async function getAdaProjects() {
    return await db.select().from(adaTable);
}

// ajouté pour récupérer les projets d'un utilisateur spécifique

export async function getUserProjects(userId: string): Promise<ProjectWithRelations[]> {
  try {
    const result = await db.execute(
      sql`
        SELECT 
          p.*,
          
          -- Infos promotion
          json_build_object(
            'id', prom.id,
            'name', prom.name
          ) as promotion,
          
          -- Infos ada_project
          json_build_object(
            'id', ada.id,
            'name', ada.name
          ) as ada_project,
          
          -- ✅ Nombre de commentaires
          COUNT(c.id) as comments_count,
          
          -- ✅ Commentaires groupés
          COALESCE(
            json_agg(
              json_build_object(
                'id', c.id,
                'message', c.message,
                'created_at', c.created_at,
                'user', json_build_object(
                  'id', u.id,
                  'name', u.name,
                  'image', u.image
                )
              )
              ORDER BY c.created_at DESC
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::json
          ) as comments
          
        FROM students_projects p
        LEFT JOIN promotions prom ON prom.id = p.promotion_id
        LEFT JOIN ada_projects ada ON ada.id = p.ada_project_id
        LEFT JOIN comments c ON c.project_id = p.id
        LEFT JOIN "user" u ON u.id = c.user_id
        
        WHERE p.user_id = ${userId}
        
        GROUP BY p.id, prom.id, prom.name, ada.id, ada.name
        ORDER BY p.published_at DESC NULLS LAST
      `
    );

    return result.rows as ProjectWithRelations[];
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return [];
  }
}