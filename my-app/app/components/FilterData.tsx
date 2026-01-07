"use client";

import ProjectList from "./ProjectList";
import type { ProjectWithRelations, Promotion, Session } from "@/app/types";
import { useSearchParams } from "next/navigation";

type Props = {
  projects: ProjectWithRelations[];
};

export default function FilterData({ projects }: Props) {

  const params = useSearchParams();
  const selectedPromo = params.get("promo");

  const filteredProjects = projects.filter((project) => {
    if (selectedPromo === "" || selectedPromo === null) return true;
    return project.promotion?.id === Number(selectedPromo);
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="bg-ada-bg min-h-screen py-12">
        <h1 className="text-white text-center text-2xl font-Oswald-medium">Aucun projet trouvé.</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Liste des projets */}
      <ProjectList projects={filteredProjects} />
    </div>
  );
}
