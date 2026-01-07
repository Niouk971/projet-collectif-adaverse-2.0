"use client";

import ProjectCardAdmin from "./ProjectCardAdmin";
import type { ProjectWithRelations } from "@/app/types";
import { useSearchParams } from "next/navigation";

type Props = {
    projects: ProjectWithRelations[];
    showPendingOnly: boolean;
    setShowPendingOnly: (value: boolean) => void;
};

export default function ProjectListAdmin({ projects, showPendingOnly, setShowPendingOnly }: Props) {
    const searchParams = useSearchParams();
    const promoFilter = searchParams.get("promo");

    // 1️⃣ Filtre par promotion
    const promoFiltered = promoFilter
        ? projects.filter((p) => String(p.promotion_id) === promoFilter)
        : projects;

    // 2️⃣ Filtre "en attente" si activé
    const finalFiltered = showPendingOnly
        ? promoFiltered.filter((p) => !p.published_at)
        : promoFiltered;

    // 3️⃣ Regroupement par catégorie Ada
    const grouped: Record<string, ProjectWithRelations[]> = {};

    for (let item of finalFiltered) {
        const adaName = item.ada_project?.name || "Sans catégorie";
        if (!grouped[adaName]) {
            grouped[adaName] = [];
        }
        grouped[adaName].push(item);
    }


    const sortedCategories = Object.entries(grouped).sort((a, b) =>
        a[0].localeCompare(b[0])
    );

    return (
        <div className="bg-ada-bg min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-center mb-12">
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
                        <option value="all" className="font-Oswald-regular">Tous les projets</option>
                        <option value="pending" className="font-Oswald-regular">Projets en attente</option>
                    </select>
                </div>

                {sortedCategories.map(([adaName, projectsList]) => (
                    <div key={adaName} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-4xl">
                                <span className="text-white font-Oswald-light">Projets </span>
                                <span className="text-ada-red font-Oswald-medium">{adaName}</span>
                                <span className="text-white ml-2 font-Oswald-light text-2xl">
                                    ({projectsList.length})
                                </span>
                            </h2>
                            <div className="flex-1 h-1 bg-linear-to-r from-ada-red to-transparent rounded" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectsList.map((project) => (
                                <ProjectCardAdmin
                                    key={project.id}
                                    projectId={project.id}
                                    project={project}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}