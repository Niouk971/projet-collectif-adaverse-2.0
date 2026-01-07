"use client";

import { useState } from "react";
import ProjectListAdmin from "./ProjectListAdmin";
import type { ProjectWithRelations, Promotion } from "@/app/types";
import { useSearchParams } from "next/navigation";

type Props = {
  projects: ProjectWithRelations[];
  promos: Promotion[];
};

export default function FilterDataAdmin({ projects, promos }: Props) {
  const params = useSearchParams();
  const promoFromUrl = params.get("promo");

  const [showPendingOnly, setShowPendingOnly] = useState(false);

  // Vérifie si la promo existe dans la DB
  const promoExists =
    promoFromUrl && promos.some((p) => String(p.id) === promoFromUrl);

  // 1️⃣ Filtre par promotion
  const promoFiltered = promoFromUrl
    ? projects.filter((p) => String(p.promotion_id) === promoFromUrl)
    : projects;

  // 2️⃣ Filtre par projets en attente
  const finalFiltered = showPendingOnly
    ? promoFiltered.filter((p) => !p.published_at)
    : promoFiltered;

  // 3️⃣ CAS 2 : promo existe mais aucun projet dans cette promo → PAS DE SELECT
  if (promoExists && promoFiltered.length === 0) {
    return (
      <div className="bg-ada-bg min-h-screen py-12">
        <h1 className="text-white text-center text-2xl font-Oswald-medium">
          Aucun projet trouvé.
        </h1>
      </div>
    );
  }

  // 4️⃣ CAS : promo n'existe pas du tout → PAS DE SELECT
  if (promoFromUrl && !promoExists) {
    return (
      <div className="bg-ada-bg min-h-screen py-12">
        <h1 className="text-white text-center text-2xl font-Oswald-medium">
          Aucun projet trouvé.
        </h1>
      </div>
    );
  }

  // 5️⃣ CAS : promo existe + projets existent mais aucun en attente → SELECT + MESSAGE
  if (finalFiltered.length === 0) {
    return (
      <div className="bg-ada-bg min-h-screen py-12">
        {/* Select visible */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex justify-center">
            <select
              value={showPendingOnly ? "pending" : "all"}
              onChange={(e) => setShowPendingOnly(e.target.value === "pending")}
              className="
                font-Oswald-semibold
                px-6 py-3 rounded-lg font-semibold 
                bg-white text-gray-800 
                border-2 border-gray-300 
                shadow-md 
                hover:border-ada-red 
                focus:border-ada-red focus:ring-2 focus:ring-ada-red/30 
                transition-all
                cursor-pointer
              "
            >
              <option value="all" className="font-Oswald-regular">
                Tous les projets
              </option>
              <option value="pending" className="font-Oswald-regular">
                Projets en attente
              </option>
            </select>
          </div>
        </div>

        <h1 className="text-white text-center text-2xl font-Oswald-medium">
          Aucun projet trouvé.
        </h1>
      </div>
    );
  }

  // 6️⃣ CAS NORMAL : projets trouvés
  return (
    <div>
      <ProjectListAdmin
        projects={finalFiltered}
        showPendingOnly={showPendingOnly}
        setShowPendingOnly={setShowPendingOnly}
      />
    </div>
  );
}