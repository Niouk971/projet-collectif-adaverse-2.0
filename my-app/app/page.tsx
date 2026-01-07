import { getAllProjects } from "./actions/project";
import FilterData from "./components/FilterData";

export default async function Home() {
  const projects = await getAllProjects(); // Déjà ProjectWithRelations[]
  
  // 🔥 Filtrer uniquement les projets publiés
  const publishedProjects = projects.filter(
    (p) => p.published_at !== null
  );

  return (
    <div>
      <FilterData 
        projects={publishedProjects}
      />
    </div>
  );
}