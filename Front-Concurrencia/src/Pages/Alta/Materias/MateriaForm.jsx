import { useState } from "react";

export default function MateriaForm({ cuatrimestreId, setMaterias }) {
  const [nombre, setNombre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaMateria = {
      id: Date.now(),
      cuatrimestreId,
      nombre,
    };

    setMaterias((prev) => [...prev, nuevaMateria]);
    setNombre("");
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Registrar Materia</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="font-semibold">Nombre de la Materia</label>
          <input
            className="w-full p-3 border rounded-lg"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Matemáticas Discretas"
            required
          />
        </div>

        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
