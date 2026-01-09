import { addProject } from "@/app/actions/project"
import type { Promotion, AdaProject } from "@/app/types"
import SelectAdaProject from "./SelectAdaProject"
import SelectPromo from "./SelectPromo"

type Props = {
    promos: Promotion[]
    adaProjects: AdaProject[]
    setIsOpen: (value: boolean) => void
}

export default function Formulaire({ promos, adaProjects, setIsOpen }: Props) {
    return (
        // Overlay avec flou - cliquer dessus ferme le modal
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in"
            onClick={() => setIsOpen(false)}
        >
             {/* Carte du formulaire - empêcher la fermeture quand on clique dedans */}
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Titre */}
                <h2 className="text-3xl font-oswald-bold mb-6 text-center">
                    <span className="text-ada-dark">PROPOSER UN </span>
                    <span className="text-ada-red">PROJET ✨</span>
                </h2>

                <form
                    action={async (formData) => {
                        await addProject(formData)
                        setIsOpen(false)
                    }}
                    className="space-y-5"
                >
                    {/* Input Nom */}
                    <div>
                        <label className="block font-oswald-semibold text-ada-dark mb-2">
                            Nom du projet
                        </label>
                        <input
                            name="name"
                            placeholder="Ex: Mon super quiz"
                            required
                            className="font-oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all"
                        />
                    </div>

                    {/* Input GitHub */}
                    <div>
                        <label className="block font-oswald-semibold text-ada-dark mb-2">
                            URL GitHub
                        </label>
                        <input
                            name="github_url"
                            placeholder="https://github.com/..."
                            required
                            type="url"
                            className="font-oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all"
                        />
                    </div>

                    {/* Input Demo */}
                    <div>
                        <label className="block font-oswald-semibold text-ada-dark mb-2">
                            URL de la démo
                        </label>
                        <input
                            name="demo_url"
                            placeholder="https://..."
                            required
                            type="url"
                            className="font-oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all"
                        />
                    </div>

                    <SelectPromo promos={promos} />
                    <SelectAdaProject adaProjects={adaProjects} />


                    {/* Boutons */}
                      <button
                        type="submit"
                        className="w-full bg-ada-red hover:bg-ada-coral text-white font-black py-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all mt-6 font-oswald-bold text-2xl"
                    >
                        ENVOYER 🚀
                    </button>
                </form>
            </div>
        </div>
    )
}
