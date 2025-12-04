import { useState } from "react";
import { cuatrimestresService } from "../../../Services/programasService";

export default function CuatrimestreList({ 
  cuatrimestres, 
  onCuatrimestreDeleted, 
  onCuatrimestreUpdated,
  programaId 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editNumero, setEditNumero] = useState("");
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cuatrimestre?")) {
      return;
    }

    setLoading({ ...loading, [id]: true });
    setError(null);

    try {
      const result = await cuatrimestresService.delete(id);

      if (result.success) {
        if (onCuatrimestreDeleted) {
          onCuatrimestreDeleted();
        }
      } else {
        setError(result.message || "Error al eliminar el cuatrimestre");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading({ ...loading, [id]: false });
    }
  };

  const handleEdit = (cuatrimestre) => {
    setEditingId(cuatrimestre.id);
    setEditNombre(cuatrimestre.nombre);
    setEditNumero(cuatrimestre.numero);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNombre("");
    setEditNumero("");
  };

  const handleSaveEdit = async (id) => {
    if (!editNombre.trim() || !editNumero) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading({ ...loading, [`edit-${id}`]: true });
    setError(null);

    try {
      const cuatrimestreData = {
        programa_id: parseInt(programaId),
        numero: parseInt(editNumero),
        nombre: editNombre.trim()
      };

      const result = await cuatrimestresService.update(id, cuatrimestreData);

      if (result.success) {
        setEditingId(null);
        if (onCuatrimestreUpdated) {
          onCuatrimestreUpdated();
        }
      } else {
        setError(result.message || "Error al actualizar el cuatrimestre");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading({ ...loading, [`edit-${id}`]: false });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de error */}
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

      {cuatrimestres.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg font-medium mb-2">
            No hay cuatrimestres registrados
          </p>
          <p className="text-gray-500 max-w-md mx-auto">
            Comienza registrando el primer cuatrimestre utilizando el formulario
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cuatrimestres.map((cuatrimestre) => (
            <div 
              key={cuatrimestre.id} 
              className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300"
            >
              {editingId === cuatrimestre.id ? (
                // MODO EDICIÓN
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Editando Cuatrimestre
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(cuatrimestre.id)}
                        disabled={loading[`edit-${cuatrimestre.id}`]}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
                      >
                        {loading[`edit-${cuatrimestre.id}`] ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading[`edit-${cuatrimestre.id}`]}
                        className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-gray-700 font-semibold">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300"
                        placeholder="Nombre del cuatrimestre"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-gray-700 font-semibold">
                        Número
                      </label>
                      <input
                        type="number"
                        value={editNumero}
                        onChange={(e) => setEditNumero(e.target.value)}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300"
                        placeholder="Número"
                        min="1"
                        max="16"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // MODO VISUALIZACIÓN
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mr-5 shadow-sm">
                        <span className="text-2xl font-bold text-blue-800">
                          #{cuatrimestre.numero}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {cuatrimestre.nombre}
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          <span className="inline-flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            ID: {cuatrimestre.id}
                          </span>
                          {cuatrimestre.created_at && (
                            <span className="inline-flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Creado: {formatDate(cuatrimestre.created_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEdit(cuatrimestre)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cuatrimestre.id)}
                      disabled={loading[cuatrimestre.id]}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      {loading[cuatrimestre.id] ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}