export default function MateriaList({ materias }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Materias Registradas</h2>

      {materias.length === 0 ? (
        <p className="text-gray-500">Aún no hay materias registradas.</p>
      ) : (
        <ul className="space-y-4">
          {materias.map((m) => (
            <li
              key={m.id}
              className="p-4 border rounded-lg shadow-sm"
            >
              <p className="font-bold">{m.nombre}</p>
              <p className="text-gray-600 text-sm">
                Cuatrimestre ID: {m.cuatrimestreId}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
