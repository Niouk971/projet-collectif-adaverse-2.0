"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Promotion, SelectChangeEvent } from "../types";

type Props = {
  promos: Promotion[];
};

export default function NavSelect({ promos }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Valeur actuelle dans l’URL
  const selectedPromo = searchParams.get("promo") || "";

  const handleChange = (e: SelectChangeEvent) => {
    const promo = e.target.value;

    // Base selon la page actuelle
    const base = pathname.startsWith("/admin") ? "/admin" : "/";

    router.push(`${base}?promo=${promo}`);
  };

  return (
    <div className="flex items-end gap-3">
      <select
        value={selectedPromo}
        onChange={handleChange}
        className="
          font-Oswald-semibold border-2 border-gray-300 rounded-lg px-4 py-2.5 
          bg-white text-ada-dark focus:outline-none focus:border-ada-red 
          focus:ring-2 focus:ring-ada-red/20 transition-all cursor-pointer
        "
      >
        <option value="">TOUTES LES PROMOS ⭐</option>

        {promos.map((promo) => (
          <option key={promo.id} value={promo.id}>
            {promo.name}
          </option>
        ))}
      </select>
    </div>
  );
}