"use client";

import { useState } from "react";
import FormModal from "../formulaire/FormModal";
import ProjectListAdmin from "./ProjectListAdmin";
import type { ProjectWithRelations, Promotion } from "@/app/types";

type Props = {
  projects: ProjectWithRelations[];
  promos: Promotion[];
};

export default function FilterDataAdmin({ projects, promos }: Props) {
  const [selectedPromo, setSelectedPromo] = useState("");

  const filteredProjects = projects.filter((project) => {
    if (selectedPromo === "") return true;
    return project.promotion?.id === Number(selectedPromo);
  });

  return (
    <div>

      {/* Liste des projets */}
      <ProjectListAdmin projects={filteredProjects} />
    </div>
  );
}






