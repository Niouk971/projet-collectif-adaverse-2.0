"use server"

import { auth } from "@/app/lib/auth";
import {  headers } from "next/headers";
import { db } from "../lib/db/drizzle";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { user } from "../lib/db/schema";

// Ban un user
export async function banishUser(userId: string) {
    // 1. Vérifier que l'utilisateur est connecté
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Vous devez être connecté");
    }

    // 3. Vérifier l'id de l'utilisateur
    const userToBanish = await db.select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!userToBanish[0]) {
        throw new Error("Utilisateur introuvable");
    }

    // 4. Mettre à jour le statut de l'utilisateur
    await db.update(user)
        .set({ isBanished: true })
        .where(eq(user.id, userId));
        
        revalidatePath("/project/[slug]");
    
    
}

// app/actions/users.ts - Ajouter ces fonctions

export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const newPassword = formData.get("password") as string;

  // Mise à jour du nom et email
  await db
    .update(user)
    .set({ 
      name, 
      email,
      updatedAt: new Date() 
    })
    .where(eq(user.id, session.user.id));

  // Si un nouveau mot de passe est fourni
  if (newPassword && newPassword.trim() !== "") {
    // Better-Auth gère le hachage du mot de passe
    // Tu devras utiliser l'API Better-Auth pour ça
    // Voir leur documentation: https://www.better-auth.com/docs/concepts/password
  }

  revalidatePath("/profile");
}

export async function updateUserImage(imageUrl: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Non authentifié");
  }

  await db
    .update(user)
    .set({ 
      image: imageUrl,
      updatedAt: new Date() 
    })
    .where(eq(user.id, session.user.id));

  revalidatePath("/profile");
}