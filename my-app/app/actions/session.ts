"use server"
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export const getSession = async () => {

    try {
        const headerList = await headers();

        const session = await auth.api.getSession({ headers: headerList, });

        if (!session || !session.user) {
            return null
        };
        return {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
        }

    } catch (error) {
        console.error("Erreur lors de la recuperation de la session", error)

        return null;
    }
}