"use client";
import Image from "next/image";

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
};

export default function CommentsList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-500 text-lg">
          💬 Aucun commentaire pour le moment
        </p>
        <span className=" text-ada-red text-sm">
          Connectez-vous pour ajouter un commentaire
        </span>
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
            className="border-l-4 border-ada-red pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r-lg"
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
          </div>
        ))}
        <span className=" text-ada-red text-sm">
          Connectez-vous pour ajouter un commentaire
        </span>
      </div>
    </div>
  );
}
