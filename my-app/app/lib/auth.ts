import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/lib/db/drizzle"; // Change l'import en fonction de TON
import * as schema from "@/app/lib/db/schema"; // Change l'import en fonction
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true, // On active les comptes par email et mot de passe
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema, // Ajoute ton schéma de DB
    }),
    plugins: [nextCookies()], // ⚠ Permet de sauvegarder les cookies
})
