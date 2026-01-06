import ProjectCardAdmin from "./ProjectCardAdmin";
import type { ProjectWithRelations } from "@/app/types";

type Props = {
    projects: ProjectWithRelations[];
    showPendingOnly: boolean;
    setShowPendingOnly: (value: boolean) => void;
};

export default function ProjectListAdmin({ projects, showPendingOnly, setShowPendingOnly }: Props) {
    const grouped: Record<string, ProjectWithRelations[]> = {};

    // Regroupement par catégorie Ada (ada_project)
    for (let item of projects) {
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

                {/* ✅ Bouton centré au-dessus des projets */}
                <div className="flex justify-center mb-12">
                    <button
                        onClick={() => setShowPendingOnly(!showPendingOnly)}
                        className={`px-6 py-3 rounded font-semibold transition ${showPendingOnly ? "bg-gray-200 text-gray-800" : "bg-yellow-500 text-white"}`}
                    >
                        {showPendingOnly ? "Voir tous les projets" : "Voir uniquement les projets en attente"}
                    </button>
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