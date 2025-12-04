import { useState } from "react";
import { cuatrimestresService } from "../../../Services/cuatrimestresService";

export default function CuatrimestreForm({ programaId, onCuatrimestreCreated }) {
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim() || !numero.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const cuatrimestreData = {
        programa_id: parseInt(programaId),
        numero: parseInt(numero),
        nombre: nombre.trim()
      };

      const result = await cuatrimestresService.create(cuatrimestreData);

      if (result.success) {
        // Resetear formulario
        setNombre("");
        setNumero("");
        setSuccess(true);
        
        // Notificar al componente padre
        if (onCuatrimestreCreated) {
          onCuatrimestreCreated();
        }

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || "Error al crear el cuatrimestre");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Mensajes de estado */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-emerald-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-emerald-600">¡Cuatrimestre creado exitosamente!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* CAMPO 1: NOMBRE */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <label className="block text-gray-800 font-bold text-xl mb-3">
              Nombre del Cuatrimestre
            </label>
            <p className="text-gray-600 text-base mb-4">
              Asigna un nombre descriptivo al cuatrimestre
            </p>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-white border-2 border-gray-300 rounded-xl px-6 py-5 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
              placeholder="Ej: Primer Cuatrimestre, Cuatrimestre de Iniciación"
              required
              disabled={loading}
            />
            <p className="text-gray-500 text-sm mt-3">
              Este nombre aparecerá en reportes y listados
            </p>
          </div>

          {/* CAMPO 2: NÚMERO */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <label className="block text-gray-800 font-bold text-xl mb-3">
              Número del Cuatrimestre
            </label>
            <p className="text-gray-600 text-base mb-4">
              Especifica el número secuencial del cuatrimestre
            </p>
            <div className="relative">
              <input
                type="number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-6 py-5 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm appearance-none"
                placeholder="Ej: 1, 2, 3..."
                min="1"
                max="16"
                required
                disabled={loading}
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">
                número
              </div>
            </div>
            
            {/* VISUALIZACIÓN DEL NÚMERO */}
            <div className="mt-6">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-5 rounded-xl border border-blue-200">
                <div className="text-center">
                  <p className="text-gray-600 text-base mb-2">Previsualización:</p>
                  <div className="inline-flex items-center bg-white px-8 py-3 rounded-lg shadow-sm">
                    <span className="text-blue-800 font-bold text-2xl">
                      Cuatrimestre #{numero || "?"}
                    </span>
                    {nombre && (
                      <span className="text-gray-700 text-lg ml-4">
                        - {nombre}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEPARADOR */}
        <div className="border-t-2 border-gray-300 my-6"></div>

        {/* BOTÓN */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            } text-white py-5 rounded-xl font-bold text-xl transition-all duration-300 border-2 border-blue-700 hover:border-blue-800 shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin h-7 w-7 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Registrar Cuatrimestre
                </>
              )}
            </div>
          </button>
          <p className="text-gray-500 text-center text-sm mt-4">
            El cuatrimestre será agregado al programa seleccionado
          </p>
        </div>

      </form>
    </div>
  );
}