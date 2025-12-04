import { useState } from "react";
import { materiasService } from "../../../Services/materias.service";

export default function MateriaList({ 
  materias, 
  onMateriaDeleted, 
  onMateriaUpdated,
  cuatrimestreId 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editCodigo, setEditCodigo] = useState("");
  const [editCreditos, setEditCreditos] = useState("");
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta materia? También se eliminarán las asignaciones a docentes.")) {
      return;
    }

    setLoading(prev => ({ ...prev, [id]: true }));
    setError(null);

    try {
      const result = await materiasService.delete(id);

      if (result.success) {
        if (onMateriaDeleted) {
          onMateriaDeleted();
        }
      } else {
        setError(result.message || "Error al eliminar la materia");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (materia) => {
    setEditingId(materia.id);
    setEditNombre(materia.nombre);
    setEditCodigo(materia.codigo);
    setEditCreditos(materia.creditos.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNombre("");
    setEditCodigo("");
    setEditCreditos("");
  };

  const handleSaveEdit = async (id) => {
    if (!editNombre.trim() || !editCodigo.trim() || !editCreditos) {
      setError("Por favor completa todos los campos");
      return;
    }

    const loadingKey = `edit-${id}`;
    setLoading(prev => ({ ...prev, [loadingKey]: true }));
    setError(null);

    try {
      const materiaData = {
        cuatrimestre_id: parseInt(cuatrimestreId),
        nombre: editNombre.trim(),
        codigo: editCodigo.trim(),
        creditos: parseInt(editCreditos)
      };

      const result = await materiasService.update(id, materiaData);

      if (result.success) {
        setEditingId(null);
        if (onMateriaUpdated) {
          onMateriaUpdated();
        }
      } else {
        setError(result.message || "Error al actualizar la materia");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (error) {
      return dateString;
    }
  };

  // Función para obtener color según créditos
  const getCreditosColor = (creditos) => {
    if (creditos >= 8) return "bg-red-100 text-red-800";
    if (creditos >= 6) return "bg-orange-100 text-orange-800";
    if (creditos >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
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

      {!Array.isArray(materias) || materias.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg font-medium mb-2">
            No hay materias registradas
          </p>
          <p className="text-gray-500 max-w-md mx-auto">
            Comienza registrando la primera materia utilizando el formulario
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {materias.map((materia) => (
            <div 
              key={materia.id} 
              className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-purple-300"
            >
              {editingId === materia.id ? (
                // MODO EDICIÓN
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Editando Materia
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(materia.id)}
                        disabled={loading[`edit-${materia.id}`]}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md"
                      >
                        {loading[`edit-${materia.id}`] ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading[`edit-${materia.id}`]}
                        className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="block text-gray-700 font-semibold">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 hover:border-gray-400 transition-all duration-300"
                        placeholder="Nombre de la materia"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-gray-700 font-semibold">
                        Código
                      </label>
                      <input
                        type="text"
                        value={editCodigo}
                        onChange={(e) => setEditCodigo(e.target.value)}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 hover:border-gray-400 transition-all duration-300"
                        placeholder="Código (ej: PROG101)"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-gray-700 font-semibold">
                        Créditos
                      </label>
                      <input
                        type="number"
                        value={editCreditos}
                        onChange={(e) => setEditCreditos(e.target.value)}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 hover:border-gray-400 transition-all duration-300"
                        placeholder="Créditos"
                        min="1"
                        max="12"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // MODO VISUALIZACIÓN
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start mb-4">
                      <div className={`px-4 py-2 rounded-xl font-bold text-lg mr-5 ${getCreditosColor(materia.creditos)}`}>
                        {materia.creditos} créditos
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-2xl font-bold text-gray-800 mr-4">
                            {materia.nombre}
                          </h3>
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">
                            {materia.codigo}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <span className="inline-flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            ID: {materia.id}
                          </span>
                          {materia.created_at && (
                            <span className="inline-flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Creado: {formatDate(materia.created_at)}
                            </span>
                          )}
                          {materia.cuatrimestre_numero && (
                            <span className="inline-flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Cuatrimestre #{materia.cuatrimestre_numero}
                            </span>
                          )}
                          {materia.programa_nombre && (
                            <span className="inline-flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {materia.programa_nombre}
                            </span>
                          )}
                          {materia.docente_nombre && (
                            <span className="inline-flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Docente: {materia.docente_nombre}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEdit(materia)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(materia.id)}
                      disabled={loading[materia.id]}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      {loading[materia.id] ? (
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