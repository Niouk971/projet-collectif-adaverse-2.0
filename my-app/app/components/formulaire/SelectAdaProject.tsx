export default function SelectAdaProject({ adaProjects }: { adaProjects: { id: number; name: string }[] }) {
    return (
        <div>
            <label className="block font-oswald-semibold text-ada-dark mb-2">
                Projet Ada
            </label>
            <select
                name="adaProjectId"
                required
                className="font-oswald-regular w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-ada-red focus:ring-2 focus:ring-ada-red/20 transition-all cursor-pointer"
            >
                <option value="">Sélectionner un projet</option>
                {adaProjects.map((ada) => (
                    <option className="font-oswald-light" key={ada.id} value={ada.id}>
                        {ada.name}
                    </option>
                ))}
            </select>
        </div>
    )
}