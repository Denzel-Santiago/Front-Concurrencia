import { useState } from "react";
import { materiasService } from "./services/materias.service";

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

  const getCreditosColor = (creditos) => {
    if (creditos >= 8) return "bg-red-100 text-red-800";
    if (creditos >= 6) return "bg-orange-100 text-orange-800";
    if (creditos >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Materias Registradas</h2>

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!Array.isArray(materias) || materias.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aún no hay materias registradas.</p>
      ) : (
        <ul className="space-y-4">
          {materias.map((materia) => (
            <li key={materia.id} className="p-4 border rounded-lg shadow-sm">
              {editingId === materia.id ? (
                // MODO EDICIÓN
                <div>
                  <h3 className="font-bold text-lg mb-3">Editando Materia</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre</label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Nombre de la materia"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Código</label>
                      <input
                        type="text"
                        value={editCodigo}
                        onChange={(e) => setEditCodigo(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Código"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Créditos</label>
                      <input
                        type="number"
                        value={editCreditos}
                        onChange={(e) => setEditCreditos(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Créditos"
                        min="1"
                        max="12"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(materia.id)}
                        disabled={loading[`edit-${materia.id}`]}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        {loading[`edit-${materia.id}`] ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading[`edit-${materia.id}`]}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // MODO VISUALIZACIÓN
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-lg">{materia.nombre}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-600 text-sm">Código: {materia.codigo}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCreditosColor(materia.creditos)}`}>
                          {materia.creditos} créditos
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(materia)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(materia.id)}
                        disabled={loading[materia.id]}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        {loading[materia.id] ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>ID: {materia.id}</p>
                    {materia.created_at && (
                      <p>Creado: {formatDate(materia.created_at)}</p>
                    )}
                    {materia.cuatrimestre_numero && (
                      <p>Cuatrimestre: #{materia.cuatrimestre_numero}</p>
                    )}
                    {materia.programa_nombre && (
                      <p>Programa: {materia.programa_nombre}</p>
                    )}
                    {materia.docente_nombre && (
                      <p>Docente: {materia.docente_nombre}</p>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}