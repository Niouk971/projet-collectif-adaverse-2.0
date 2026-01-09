"use client"
import { useEffect, useState } from "react"
import { getPromotions } from "../actions/project"
import type { Promotion, SelectChangeEvent } from "../types"
import { useRouter } from "next/navigation"

export default function NavSelect ({}) {
    const [promos, setPromos] = useState<Promotion[]>([])

    useEffect(()=> {
        getPromotions().then(setPromos)
    }, [])

    const router = useRouter()
    const handleChange = (e: SelectChangeEvent) => {
        router.push(`/?promo=${e.target.value}`)
    }
    return (
        <div className="flex items-end gap-3">
            {/* Filtre promo */}
            <select
              onChange={handleChange}
              className="font-Oswald-semibold border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white text-ada-dark focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all cursor-pointer"
            >
              <option className="font-Oswald-semibold" value="">TOUTES LES PROMOS ⭐</option>
              {promos.map((promo) => (
                <option className="font-Oswald-regular" key={promo.id} value={promo.id}>
                  {promo.name}
                </option>
              ))}
            </select>
          </div>
    )
}