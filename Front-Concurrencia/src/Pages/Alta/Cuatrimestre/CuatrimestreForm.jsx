import { useState } from "react";
import { materiasService } from "../../../Services/materias.service";

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
        // Resetear formulario
        setNombre("");
        setCodigo("");
        setCreditos("");
        setSuccess(true);
        
        // Notificar al componente padre
        if (onMateriaCreated) {
          onMateriaCreated();
        }

        // Ocultar mensaje de éxito después de 3 segundos
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
    <div className="space-y-6">
      {/* Mensajes de estado */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-600 text-sm">¡Materia creada exitosamente!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CAMPO 1: NOMBRE */}
        <div className="space-y-2">
          <label className="block text-gray-800 font-bold">
            Nombre de la Materia
          </label>
          <p className="text-gray-600 text-sm">
            Nombre completo de la materia
          </p>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: Programación I, Base de Datos"
            required
            disabled={loading}
          />
        </div>

        {/* CAMPO 2: CÓDIGO */}
        <div className="space-y-2">
          <label className="block text-gray-800 font-bold">
            Código de la Materia
          </label>
          <p className="text-gray-600 text-sm">
            Código único identificador
          </p>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: PROG101, BD201"
            required
            disabled={loading}
          />
        </div>

        {/* CAMPO 3: CRÉDITOS */}
        <div className="space-y-2">
          <label className="block text-gray-800 font-bold">
            Créditos
          </label>
          <p className="text-gray-600 text-sm">
            Número de créditos académicos
          </p>
          <div className="relative">
            <input
              type="number"
              value={creditos}
              onChange={(e) => setCreditos(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ej: 4, 5, 6"
              min="1"
              max="12"
              required
              disabled={loading}
            />
          </div>
          
          {/* VISUALIZACIÓN */}
          {nombre && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-gray-600 text-sm mb-1">Previsualización:</p>
              <div className="inline-flex items-center bg-white px-4 py-2 rounded">
                <span className="text-purple-800 font-bold">
                  {codigo} - {nombre} ({creditos || "?"} créditos)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700"
            } text-white py-3 rounded-lg font-bold transition-all duration-200`}
          >
            <div className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Registrar Materia
                </>
              )}
            </div>
          </button>
          <p className="text-gray-500 text-center text-xs mt-2">
            La materia será agregada al cuatrimestre seleccionado
          </p>
        </div>

      </form>
    </div>
  );
}