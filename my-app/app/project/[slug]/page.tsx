import { getProjectBySlug } from "../../actions/project";
import Link from "next/link";
import ProjectImage from "../../components/ProjectImage";
import CommentsList from "../../components/comments/CommentsList";
import type { ProjectDetail } from "@/app/types";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/lib/db/drizzle";
import { user } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import ListConnected from "@/app/components/comments/ListConnected";
import ListAdmin from "@/app/components/comments/ListAdmin";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getProjectBySlug(slug)) as ProjectDetail | null;

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ada-dark mb-4">
            Projet non trouvé 😕
          </h1>
          <Link
            href="/"
            className="inline-block bg-ada-red hover:bg-ada-coral text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }
  const session = await auth.api.getSession({ headers: await headers() });
  // console.log("session", session);
  
  //récupérer l'état connexion et les rôles:
  let isAdmin;
  let connectedUserId;
  
  if (!session?.user?.id) {
    isAdmin = null;
    connectedUserId = null;
  } else {
    const connectedUser = await db
      .select({ 
          role: user.isAdmin,
      userId:user.id })
      .from(user)
      .where(eq(user.id, session.user.id));
    // console.log("connectedUser", connectedUser);

    isAdmin = connectedUser[0]?.role;
    connectedUserId = connectedUser[0]?.userId;
  }
  return (
    <div className="min-h-screen bg-ada-bg">

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Image */}
        <div className="bg-white rounded-2xl shadow-xl mb-6">
          <ProjectImage
            githubUrl={project.github_url}
            projectName={project.name}
            height="h-96"
          />

          {/* Infos avec le nom du projet comme titre */}
          <div className="bg-white flex flex-col rounded-2xl shadow-xl p-8 mb-15">
            <h3 className="text-4xl flex flex-wrap font-Oswald-regular justify-center text-ada-dark mb-6">
              Nom du projet :{" "}
              <span className="text-4xl font-Oswald-bold ml-2">
                {project.name}
              </span>
            </h3>

            <div className="grid grid-cols-3 divide-x divide-gray-300">
              {/* Promotion */}
              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-semibold mb-2">
                  🎓 Promotion
                </p>
                <p className="text-lg font-bold text-ada-dark">
                  {project.promotion?.name || "Non spécifiée"}
                </p>
              </div>

              {/* Projet Ada */}
              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-semibold mb-2">
                  📚 Projet Ada
                </p>
                <p className="text-lg font-bold text-ada-dark">
                  {project.ada_project?.name || "Non spécifié"}
                </p>
              </div>

              {/* Date de publication */}
              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-semibold mb-2">
                  📅 Publié le
                </p>
                <p className="text-lg font-bold text-ada-dark">
                  {project.published_at
                    ? new Date(project.published_at).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Date non disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-ada-dark hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
          >
            📂 Voir sur GitHub
          </a>

          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-ada-red hover:bg-ada-coral text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
            >
              🚀 Voir la démo
            </a>
          )}
        </div>

        {/* ✅ Section Commentaires si utilisateur pas connecté*/}
        {!session && <CommentsList comments={project.comments} />}
        {isAdmin === false && connectedUserId && <ListConnected comments={project.comments} userId={connectedUserId} projectId={project.id}  />}
        {isAdmin === true && connectedUserId && <ListAdmin comments={project.comments} userId={connectedUserId} />}

      </main>
    </div>
  );
}
