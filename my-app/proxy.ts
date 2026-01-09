import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db/drizzle";
import { user } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;

  // Protéger uniquement /admin
  if (!url.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 1️⃣ Récupérer la session SAFE
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.redirect(
      new URL("/?form=signin&error=not-logged-in", req.url)
    );
  }

  // 2️⃣ Récupérer l'utilisateur complet via Drizzle
  const fullUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!fullUser) {
    return NextResponse.redirect(
      new URL("/?form=signin&error=user-not-found", req.url)
    );
  }

  // 3️⃣ Vérifier isAdmin
  if (!fullUser.isAdmin) {
    return NextResponse.redirect(
      new URL("/?error=forbidden", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};