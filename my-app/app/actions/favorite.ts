"use server";

import { db } from "@/app/lib/db/drizzle";
import { favoritesTable,projectsTable } from "@/app/lib/db/schema";
import { getSession } from "@/app/actions/session";
import { and, eq,sql } from "drizzle-orm";

export async function addFavorite(projectId: number) {
  const session = await getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté");
  }

  await db.insert(favoritesTable).values({
    id: crypto.randomUUID(),
    userId: session.id,
    projectId,
    createdAt: new Date(),
  });
}

export async function isFavorite(projectId: number) {
  const session = await getSession();

  if (!session) {
    return false;
  }

  const result = await db
    .select({ id: favoritesTable.id })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, session.id),
        eq(favoritesTable.projectId, projectId)
      )
    )
    .limit(1);

  return result.length > 0;
}
export async function removeFavorite(projectId: number) {
  const session = await getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté");
  }

  await db
    .delete(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, session.id),
        eq(favoritesTable.projectId, projectId)
      )
    );
}

export async function getFavorites() {
  const session = await getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté");
  }

  const favorites = await db
    .select({
      id: projectsTable.id,
      name: projectsTable.name,
      slug: projectsTable.slug,
      githubUrl: projectsTable.github_url,
      demoUrl: projectsTable.demo_url,
      publishedAt: projectsTable.published_at,
    })
    .from(favoritesTable)
    .innerJoin(
      projectsTable,
      eq(favoritesTable.projectId, projectsTable.id)
    )
    .where(eq(favoritesTable.userId, session.id));

  return favorites;
}

export async function getFavoritesCount() {
  const session = await getSession();
  if (!session) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, session.id));

  return Number(result[0]?.count ?? 0);
}
