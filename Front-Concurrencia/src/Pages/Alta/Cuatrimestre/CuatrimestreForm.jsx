import { useState } from "react";

export default function CuatrimestreForm({ programaId, setCuatrimestres }) {
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevo = {
      id: Date.now(),
      programaId,
      nombre,
      numero
    };

    setCuatrimestres((prev) => [...prev, nuevo]);

    setNombre("");
    setNumero("");
  };

  return (
    <div className="space-y-10">
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
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-5 rounded-xl font-bold text-xl transition-all duration-300 border-2 border-blue-700 hover:border-blue-800 shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Registrar Cuatrimestre
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