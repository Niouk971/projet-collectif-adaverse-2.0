"use client";
import { addComment } from "@/app/actions/comments";
import Image from "next/image";
import { useState } from "react";
import { deleteComment, updateComment } from "@/app/actions/comments";

type Comment = {
  id: number;
  message: string;
  created_at: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  } | null;
};

type Props = {
  comments: Comment[];
  userId: string;
  projectId: number;
};

export default function ListConnected({ comments, userId, projectId }: Props) {
  // État pour savoir quel commentaire est en cours d'édition
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");

  // Fonction pour démarrer l'édition
  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditMessage(comment.message);
  };

  // Fonction pour annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
    setEditMessage("");
  };

  // Fonction pour sauvegarder la modification
  const handleUpdate = async (commentId: number) => {
    try {
      await updateComment(commentId, editMessage);
      setEditingId(null);
      setEditMessage("");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erreur lors de la modification"
      );
    }
  };

  // Fonction pour supprimer
  const handleDelete = async (commentId: number) => {
   
      try {
        await deleteComment(commentId);
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Erreur lors de la suppression"
        );
      }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-Oswald-bold text-ada-dark mb-6 flex items-center gap-2">
        💬 Commentaires
        <span className="text-lg font-Oswald-regular text-gray-500">
          ({comments.length})
        </span>
      </h2>

      {comments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-500 text-lg">
            💬 Aucun commentaire pour le moment
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-l-4 border-ada-red pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r-lg"
            >
              {/* En-tête du commentaire */}
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
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

              {/* Message ou champ d'édition */}
              {editingId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="w-full border-2 border-ada-red rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ada-red/20"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(comment.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      ✅ Enregistrer
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {comment.message}
                  </p>

                  {/* Boutons Éditer/Supprimer (uniquement pour ses commentaires) */}
                  {userId === comment.user?.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(comment)}
                        className="bg-ada-dark hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg"
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {/* champ input ajout commentaire */}
          <form className="flex gap-6 mt-6" action={addComment}>
            <input
              type="text"
              placeholder="Ajouter un commentaire"
              name="comment"
              className="font-Oswald-regular w-8/10 border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all"
            />
            
            <input type="hidden" name= "userId" value={userId}/>
            <input type="hidden" name="projectId"   value={projectId}/>
            <button type="submit" className=" w-1/10 h-[50px] font-Oswald-semibold flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg transition-all">
              ✍️ PUBLIER
            </button>
          </form>

    </div>
  );
}
