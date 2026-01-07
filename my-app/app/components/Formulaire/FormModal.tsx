"use client";

import {
  getPromotions,
  getAdaProjects,
} from "../../actions/project";
import { useState, useEffect } from "react";
import Formulaire from "./Formulaire";
import type { Promotion, AdaProject } from "@/app/types";

// type Props = {
//   session : Session | null
// }
export default function FormModal(){
  const [isOpen, setIsOpen] = useState(false);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [adaProjects, setAdaProjects] = useState<AdaProject[]>([]);

 

  useEffect(() => {
    if (isOpen) {
      getPromotions().then(setPromos);
      getAdaProjects().then(setAdaProjects);
    }
  }, [isOpen]);



  // if (!session) {
  //   return (
  //     <div className="flex flex-col items-center">
  //       <p className="text-sm text-gray-600 mb-2 font-oswald-regular">
  //         Connectez-vous pour proposer un projet
  //       </p>
  //       <button
  //         disabled
  //         className="bg-gray-400 text-white font-oswald-semibold px-6 py-3 rounded-lg cursor-not-allowed opacity-60"
  //       >
  //         🔒 PROPOSER UN PROJET
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-ada-red hover:bg-ada-coral text-white font-Oswald-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
      >
        ✨ PROPOSER UN PROJET
      </button>

      {isOpen && (
        <Formulaire
          promos={promos}
          adaProjects={adaProjects}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
