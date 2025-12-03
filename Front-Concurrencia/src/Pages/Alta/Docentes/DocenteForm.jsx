import { useState } from "react";

export default function DocenteForm({ cuatrimestreId, materias, setDocentes }) {
  const [nombre, setNombre] = useState("");
  const [asignaturas, setAsignaturas] = useState([]);

  const materiasFiltradas = materias.filter(
    (m) => m.cuatrimestreId == cuatrimestreId
  );

  const toggleMateria = (id) => {
    setAsignaturas((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoDocente = {
      id: Date.now(),
      nombre,
      asignaturas,
    };

    setDocentes((prev) => [...prev, nuevoDocente]);
    setNombre("");
    setAsignaturas([]);
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Registrar Docente</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="font-semibold">Nombre del Docente</label>
          <input
            className="w-full p-3 border rounded-lg"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        {/* Checkboxes de materias */}
        <div>
          <label className="font-semibold">Asignaturas a Impartir:</label>
          <div className="mt-2 space-y-2">
            {materiasFiltradas.map((m) => (
              <label key={m.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={asignaturas.includes(m.id)}
                  onChange={() => toggleMateria(m.id)}
                />
                {m.nombre}
              </label>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700"
        >
          Guardar
        </button>

      </form>
    </div>
  );
}
