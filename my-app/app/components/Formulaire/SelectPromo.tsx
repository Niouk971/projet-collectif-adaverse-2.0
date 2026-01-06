export default function SelectPromo({
  promos,
}: {
  promos: { id: number; name: string }[];
}) {
  return (
    <div>
      <label className="block font-Oswald-semibold text-ada-dark mb-2">
        Promotion
      </label>
      <select
        name="promoId"
        required
        className="font-Oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all cursor-pointer"
      >
        <option value="">Sélectionner une promo</option>
        {promos.map((promo) => (
          <option className="font-Oswald-light" key={promo.id} value={promo.id}>
            {promo.name}
          </option>
        ))}
      </select>
    </div>
  );
}
