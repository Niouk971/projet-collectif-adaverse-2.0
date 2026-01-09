import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db/drizzle";
import { user } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import AdminNavButtonClient from "./AdminNavButtonClient";

export default async function AdminNavButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const fullUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!fullUser || !fullUser.isAdmin) return null;

  return <AdminNavButtonClient />;
}