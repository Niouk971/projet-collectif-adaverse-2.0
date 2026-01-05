"use client";

import { useState } from "react";
import ProjectListAdmin from "./ProjectListAdmin";
import type { ProjectWithRelations, Promotion } from "@/app/types";

type Props = {
  projects: ProjectWithRelations[];
  promos: Promotion[];
};

export default function FilterDataAdmin({ projects, promos }: Props) {
  const [selectedPromo, setSelectedPromo] = useState("");
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const filteredProjects = projects.filter((project) => {
    // Filtre par promotion
    if (selectedPromo !== "" && project.promotion?.id !== Number(selectedPromo)) {
      return false;
    }

    // Filtre par projets en attente
    if (showPendingOnly && project.published_at !== null) {
      return false;
    }

    return true;
  });

  return (
    <div>

      {/* Liste des projets */}
      <ProjectListAdmin
        projects={filteredProjects}
        showPendingOnly={showPendingOnly}
        setShowPendingOnly={setShowPendingOnly}
      />

    </div>
  );
}