"use client";

import Link from "next/link";
import { publishProject, deleteProject } from "@/app/actions/project";
import { useState } from "react";
import ProjectImage from "../ProjectImage";
import type { ProjectWithRelations } from "@/app/types";

type Props = {
  projectId: number;
  project: ProjectWithRelations;
};

export default function ProjectCardAdmin({ projectId, project }: Props) {
  const [loading, setLoading] = useState(false);
  const p = project;
  const isPublished = !!p.published_at;

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await publishProject(projectId);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await deleteProject(projectId);
    setLoading(false);
  };

  return (
    <Link
      href={`/project/${p.slug}`}
      className={`
        group block rounded-xl overflow-hidden relative transition-all duration-300 cursor-pointer
        ${
          isPublished
            ? "bg-white shadow-md hover:shadow-2xl border-2 border-white hover:-translate-y-1"
            : "bg-white shadow-md border-2 border-yellow-400 border-dashed"
        }
      `}
    >
      {/* Badge promotion (comme sur la page d'accueil) */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-block bg-ada-red text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg">
          {project.promotion?.name || "?"}
        </span>
      </div>

      {/* Badge "En attente" */}
      {!isPublished && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            ⏳ En attente de validation
          </span>
        </div>
      )}

      <ProjectImage
        githubUrl={p.github_url}
        projectName={p.name}
        height="h-48"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold mb-3 text-gray-700 group-hover:text-ada-red transition-colors">
          {p.name}
        </h3>

        {/* Date au format "day month year" */}
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span>📅</span>
          {isPublished
            ? new Date(p.published_at!).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "En attente de publication"}
        </p>

        {/* Nombre de commentaires */}
        <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
          <span>💬</span>
          {project.comments_count}{" "}
          {project.comments_count > 1 ? "commentaires" : "commentaire"}
        </p>

        {/* Boutons admin */}
        {!isPublished && (
          <div
            className="flex gap-2 mt-4"
            onClick={(e) => e.preventDefault()}
          >
            <button
              onClick={handlePublish}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg transition-all disabled:opacity-50"
            >
              ✓ PUBLIER
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition-all disabled:opacity-50"
            >
              ✗ REFUSER
            </button>
          </div>
        )}

        {isPublished && (
          <div className="mt-4 text-green-600 font-semibold text-sm">
            ✅ Projet publié
          </div>
        )}
      </div>
    </Link>
  );
}