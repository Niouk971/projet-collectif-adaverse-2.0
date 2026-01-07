import type { Metadata } from "next";
import "./globals.css";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import FormModal from "./components/Formulaire/FormModal";
import NavSelect from "./components/NavSelect";
import { getFavoritesCount } from "@/app/actions/favorite";

import UserSession from "./components/connection/UserSession";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Adaverse",
  description: "Group project by Guigui, Ursula, Flo et Xinzhu",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawSession = await auth.api.getSession({ headers: await headers() });
 const session = rawSession?.user
  ? { id: rawSession.user.id, name: rawSession.user.name, email: rawSession.user.email }
  : null;
const favoritesCount = await getFavoritesCount();
  return (
    <html lang="en">
      <body>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo/Titre style Ada */}
          <h1 className="text-5xl font-futura mr-auto">
            <a href="/">
              <span className="text-ada-dark font-bold">ada</span>
              <span className="text-ada-red font-normal text-5xl">verse</span>
            </a>
          </h1>

          <UserSession session={session}/>
          <NavSelect />
        <Link href="/favorites" className="relative font-semibold text-ada-red">
  Favoris
  {favoritesCount > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
      {favoritesCount}
    </span>
  )}
</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
