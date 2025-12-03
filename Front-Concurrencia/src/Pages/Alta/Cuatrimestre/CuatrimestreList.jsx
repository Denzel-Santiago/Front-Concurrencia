export default function CuatrimestreList({ cuatrimestres }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Cuatrimestres Registrados</h2>

      {cuatrimestres.length === 0 ? (
        <p className="text-gray-500">Aún no hay cuatrimestres registrados.</p>
      ) : (
        <ul className="space-y-4">
          {cuatrimestres.map((c) => (
            <li
              key={c.id}
              className="p-4 border rounded-lg shadow-sm flex justify-between"
            >
              <div>
                <p className="font-bold">{c.nombre}</p>
                <p className="text-gray-600">Número: {c.numero}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
