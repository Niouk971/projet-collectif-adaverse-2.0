"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavButtonClient() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <Link
      href={isAdminPage ? "/" : "/admin"}
      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
    >
      {isAdminPage ? "Accueil" : "Admin"}
    </Link>
  );
}
