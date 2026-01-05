// app/components/profile/UserProfileCard.tsx
"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

type UserProfileCardProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-start gap-6 mb-12 border-b border-gray-800 pb-8">
      {/* Avatar avec possibilité de changement */}
      <div className="relative group">
        <img 
          src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=96&background=DC2626&color=fff`}
          alt={user.name} 
          className="w-24 h-24 rounded-full border-2 border-red-500 object-cover"
        />
        <button 
          className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Changer la photo"
        >
          <Camera size={16} className="text-white" />
        </button>
      </div>

      {/* Infos utilisateur */}
      <div className="flex-1">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-red-500 hover:text-red-400 underline"
              >
                Éditer le profil
              </button>
            </div>
            <p className="text-gray-400">{user.email}</p>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nom</label>
              <input
                type="text"
                defaultValue={user.name}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="Laisser vide pour ne pas changer"
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-md"
              />
            </div>
            <div className="flex gap-3">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}