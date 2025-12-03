export default function DocenteList({ docentes }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Docentes Registrados</h2>

      {docentes.length === 0 ? (
        <p className="text-gray-500">Aún no hay docentes registrados.</p>
      ) : (
        <ul className="space-y-4">
          {docentes.map((d) => (
            <li
              key={d.id}
              className="p-4 border rounded-lg shadow-sm"
            >
              <p className="font-bold">{d.nombre}</p>
              <p className="text-gray-600 text-sm">
                Materias: {d.asignaturas.length}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
