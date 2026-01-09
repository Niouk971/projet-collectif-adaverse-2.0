"use client";
import { signin } from "@/app/actions/connect";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const form = searchParams.get("form");
  const userName = searchParams.get("user");

  React.useEffect(() => {
    if (error && form === "signin") {
      setIsOpen(true);
    }
  }, [error, form]);

  const handleClose = () => {
    setIsOpen(false);
    // Nettoyer l'URL si c'était une erreur de ban
    if (error === "account-banned") {
      router.push("/");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await signin(formData);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir le message de ban
  const getBanMessage = () => {
    if (userName === "Flo") {
      return "⛔ Ah oui Flo !! T'es foutu !! ";
    }
    return "⛔ Votre compte a été banni. Contactez un administrateur.";
  };

  return (
    <>
      <button
        className="bg-ada-red hover:bg-ada-coral text-white font-Oswald-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        onClick={() => setIsOpen(true)}
      >
        SE CONNECTER
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in">
          <form
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all relative"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSubmit(formData);
            }}
          >
            <button
              type="button"
              className="absolute top-4 right-4 w-10 h-10 bg-ada-red hover:bg-ada-coral text-white font-black rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-Oswald-bold text-xl"
              onClick={handleClose} // ← Utiliser handleClose au lieu de () => setIsOpen(false)
            >
              ×
            </button>

            <h2 className="text-2xl font-Oswald-bold text-ada-red mb-6">
              Connexion
            </h2>

            {error === "invalid-credentials" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
                Email ou mot de passe incorrect !
              </div>
            )}

            {error === "generic" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
                Une erreur est survenue
              </div>
            )}

            {error === "account-banned" && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-ada-red text-ada-red rounded-lg text-sm font-bold">
                {getBanMessage()}
              </div>
            )}

            <label className="block font-Oswald-regular mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="font-Oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all mb-4"
              required
            />

            <label className="block font-Oswald-regular mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              className="font-Oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all mb-4"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ada-red hover:bg-ada-coral text-white font-black py-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all mt-6 font-Oswald-bold text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Chargement..." : "valider"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
