import ProjectCard from "./ProjectCards"
import type { ProjectWithRelations } from "@/app/types"

type Props = {
  projects: ProjectWithRelations[]
}

export default function ProjectList({ projects }: Props) {
    const grouped: Record<string, ProjectWithRelations[]> = {}
    
    
    for (let project of projects) {
        const adaName = project.ada_project?.name || "Sans catégorie"
        if (!grouped[adaName]) { 
            grouped[adaName] = [] 
        }
        grouped[adaName].push(project)
        
    }

     const sortedCategories = Object.entries(grouped).sort((a, b) => 
        a[0].localeCompare(b[0])
    )

    return (
        // Fond gris
        <div className="bg-ada-bg min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {sortedCategories.map(([adaName, projectsList]) => (
                    <div key={adaName} className="mb-16">
                        
                        {/* Titre de catégorie avec ligne décorative */}
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-4xl">
                                <span className="text-white font-oswald-light">Projets </span>
                                <span className="text-ada-red font-oswald-medium">{adaName}</span>
                                <span className="text-white ml-2 font-oswald-light text-2xl">({projectsList.length})</span>
                            </h2>
                            <div className="flex-1 h-1 bg-linear-to-r from-ada-red to-transparent rounded"></div>
                        </div>

                        {/* Grille responsive des cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectsList.map((project) => (
                               <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


