"use client";
import { signup } from "@/app/actions/connect";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import React from "react";
export default function SignUp() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const form = searchParams.get("form")
    React.useEffect(() => {
      if (error && form === "signup") {
        setIsOpen(true);
      }
    }, [error, form]);
  return (
    <>
      <button
        className="bg-ada-red hover:bg-ada-coral text-white font-Oswald-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        onClick={() => setIsOpen(true)}
      >
        S'INSCRIRE
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in">
          <form
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all relative"
            action={signup}
          >
            <button
              type="button"
              className="absolute top-4 right-4 w-10 h-10 bg-ada-red hover:bg-ada-coral text-white font-black rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-Oswald-bold text-xl"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>

            <h2 className="text-2xl font-Oswald-bold text-ada-red mb-6">Inscription</h2>

            {error === "email-missing" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
                L'Email est requis.
              </div>
            )}
            {error === "name-missing" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
                Le nom est requis.
              </div>
            )}
            {error === "PASSWORD_TOO_SHORT" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
               Mot de passe trop court.
              </div>
            )}
            {error ==="USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
                Cet utilisateur existe deja. Utilisez un autre Email.
              </div>
            )}
            {error === "generic" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
                Une erreur est survenue. Vérifiez vos informations.
              </div>
            )}

            <label className="block font-Oswald-regular mb-2">Nom</label>
            <input
              type="text"
              name="name"
              className="font-Oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all mb-4"
              required
            />

            <label className="block font-Oswald-regular mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="font-Oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all mb-4"
              required
            />

            <label className="block font-Oswald-regular mb-2">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="font-Oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all mb-4"
              required
            />

            <button
              type="submit"
              className="w-full bg-ada-red hover:bg-ada-coral text-white font-black py-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all mt-6 font-Oswald-bold text-2xl"
            >
              valider
            </button>
          </form>
        </div>
      )}
    </>
  );
}