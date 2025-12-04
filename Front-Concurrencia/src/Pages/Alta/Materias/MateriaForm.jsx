import { useState } from "react";
import { materiasService } from "./services/materias.service";

export default function MateriaForm({ cuatrimestreId, onMateriaCreated }) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [creditos, setCreditos] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim() || !codigo.trim() || !creditos.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const materiaData = {
        cuatrimestre_id: parseInt(cuatrimestreId),
        nombre: nombre.trim(),
        codigo: codigo.trim(),
        creditos: parseInt(creditos)
      };

      const result = await materiasService.create(materiaData);

      if (result.success) {
        setNombre("");
        setCodigo("");
        setCreditos("");
        setSuccess(true);
        
        if (onMateriaCreated) onMateriaCreated();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || "Error al crear la materia");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Registrar Materia</h2>

      {/* Mensajes de estado */}
      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">¡Materia creada exitosamente!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="font-semibold block mb-1">Nombre de la Materia</label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Programación I, Base de Datos"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Código</label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ej: PROG101, BD201"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Créditos</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={creditos}
            onChange={(e) => setCreditos(e.target.value)}
            placeholder="Ej: 4, 5, 6"
            min="1"
            max="12"
            required
            disabled={loading}
          />
        </div>

        {/* Vista previa */}
        {nombre && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Vista previa:</p>
            <p className="font-medium">
              {codigo} - {nombre} ({creditos || "?"} créditos)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          } text-white`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            "Registrar Materia"
          )}
        </button>
      </form>
    </div>
  );
}