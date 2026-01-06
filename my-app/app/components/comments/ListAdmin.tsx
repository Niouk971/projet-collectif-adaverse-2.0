"use client";
import Image from "next/image";
import { deleteCommentAdmin } from "@/app/actions/comments";
import { banishUser } from "@/app/actions/users";

type Comment = {
  id: number;
  message: string;
  created_at: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
    isBanished: boolean;
  } | null;
};

type Props = {
  comments: Comment[];
  userId: string;
};

export default function ListAdmin({ comments, userId }: Props) {
  // Fonction pour supprimer (coté admin)
  const handleDelete = async (commentId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      try {
        await deleteCommentAdmin(commentId);
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Erreur lors de la suppression"
        );
      }
    }
  };

  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-500 text-lg">
          💬 Aucun commentaire pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-Oswald-bold text-ada-dark mb-6 flex items-center gap-2">
        💬 Commentaires
        <span className="text-lg font-Oswald-regular text-gray-500">
          ({comments.length})
        </span>
      </h2>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-l-4 border-ada-red pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r-lg flex gap-4 "
          >
            {/* En-tête du commentaire (auteur + date) */}
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {comment.user?.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ada-dark font-bold text-lg">
                    {comment.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>

              {/* Nom + Date */}
              <div className="flex-1">
                <p className="font-semibold text-ada-dark">
                  {comment.user?.name || "Anonyme"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-700 leading-relaxed ml-13">
              {comment.message}
            </p>
            <div className="ml-auto flex gap-4">
              <button 
              onClick={() => comment.user && banishUser(comment.user.id)}
              disabled={comment.user?.isBanished}
              className="w-[140px] h-[50px] font-Oswald-semibold flex-1 bg-ada-dark hover:bg-gray-800 text-white text-sm py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer">
              {comment.user?.isBanished ? "🚫 Est banni" : "🤬 Bannir"}
              </button>
              
              
              <button
                onClick={() => handleDelete(comment.id)}
                className="w-[140px] h-[50px] font-Oswald-semibold flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
