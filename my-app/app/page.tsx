import { getAllProjects } from "./actions/project";
import FilterData from "./components/FilterData";
import { ProjectWithRelations } from "./types"; // Add this import


export default async function Home() {
  const projects = await getAllProjects() as ProjectWithRelations[];
  return (
    <div>
      <FilterData 
        projects={projects}
      />
    </div>
  );
}