"use server"

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "../lib/db/drizzle";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/cache";
import { user, account } from "../lib/db/schema";

// Ban un user
export async function banishUser(userId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Vous devez être connecté");
    }

    const userToBanish = await db.select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!userToBanish[0]) {
        throw new Error("Utilisateur introuvable");
    }

    await db.update(user)
        .set({ isBanished: true })
        .where(eq(user.id, userId));
        
    revalidatePath("/project/[slug]");
}

// Mettre à jour le profil utilisateur
export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  // Si on veut changer le mot de passe
  if (newPassword && newPassword.trim() !== "") {
    if (!currentPassword) {
      throw new Error("Le mot de passe actuel est requis");
    }

    try {
      // ✅ Utiliser l'API Better-Auth pour changer le mot de passe
      // Better-Auth vérifie automatiquement l'ancien mot de passe
      await auth.api.changePassword({
        body: {
          newPassword: newPassword,
          currentPassword: currentPassword,
        },
        headers: await headers(),
      });
    } catch (error: any) {
      // Better-Auth retourne une erreur si le mot de passe actuel est incorrect
      console.error("Erreur changement mot de passe:", error);
      throw new Error("Mot de passe actuel incorrect");
    }
  }

  // Mise à jour du nom et email
  await db
    .update(user)
    .set({ 
      name, 
      email,
      updatedAt: new Date() 
    })
    .where(eq(user.id, session.user.id));

  revalidatePath("/profile");
  return { success: true };
}

// Mettre à jour l'image de profil
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
  return { success: true };
}