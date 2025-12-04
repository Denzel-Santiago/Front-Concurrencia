import { useState } from "react";
import { docentesService } from "../../../Services/docentes.service";

export default function DocenteList({ 
  docentes, 
  onDocenteDeleted, 
  onDocenteUpdated 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editEspecialidad, setEditEspecialidad] = useState("");
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar al docente "${nombre}"?\n\n⚠️ No se podrá eliminar si tiene grupos asignados.`)) {
      return;
    }

    setLoading(prev => ({ ...prev, [id]: true }));
    setError(null);

    try {
      const result = await docentesService.delete(id);

      if (result.success) {
        if (onDocenteDeleted) {
          onDocenteDeleted();
        }
      } else {
        setError(result.message || "Error al eliminar el docente. Posiblemente tiene grupos asignados.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (docente) => {
    setEditingId(docente.id);
    setEditNombre(docente.nombre_completo);
    setEditEmail(docente.email);
    setEditEspecialidad(docente.especialidad);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNombre("");
    setEditEmail("");
    setEditEspecialidad("");
  };

  const handleSaveEdit = async (id) => {
    if (!editNombre.trim() || !editEmail.trim() || !editEspecialidad.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    const loadingKey = `edit-${id}`;
    setLoading(prev => ({ ...prev, [loadingKey]: true }));
    setError(null);

    try {
      const docenteData = {
        nombre_completo: editNombre.trim(),
        email: editEmail.trim(),
        especialidad: editEspecialidad.trim()
      };

      const result = await docentesService.update(id, docenteData);

      if (result.success) {
        setEditingId(null);
        if (onDocenteUpdated) {
          onDocenteUpdated();
        }
      } else {
        setError(result.message || "Error al actualizar el docente");
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

  const getMateriasColor = (cantidad) => {
    if (cantidad >= 5) return "bg-red-100 text-red-800";
    if (cantidad >= 3) return "bg-orange-100 text-orange-800";
    if (cantidad >= 1) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Docentes Registrados</h2>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!Array.isArray(docentes) || docentes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aún no hay docentes registrados.</p>
      ) : (
        <ul className="space-y-4">
          {docentes.map((docente) => (
            <li key={docente.id} className="p-4 border rounded-lg shadow-sm">
              {editingId === docente.id ? (
                <div>
                  <h3 className="font-bold text-lg mb-3">Editando Docente</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Especialidad</label>
                      <input
                        type="text"
                        value={editEspecialidad}
                        onChange={(e) => setEditEspecialidad(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Especialidad"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(docente.id)}
                        disabled={loading[`edit-${docente.id}`]}
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                      >
                        {loading[`edit-${docente.id}`] ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading[`edit-${docente.id}`]}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{docente.nombre_completo}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-600 text-sm">{docente.email}</span>
                        <span className="text-amber-700 font-medium text-sm">{docente.especialidad}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(docente)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(docente.id, docente.nombre_completo)}
                        disabled={loading[docente.id]}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        {loading[docente.id] ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 text-sm space-y-1">
                    <div className="flex flex-wrap gap-4">
                      <span>ID: {docente.id}</span>
                      {docente.created_at && (
                        <span>Creado: {formatDate(docente.created_at)}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMateriasColor(docente.materias_asignadas || 0)}`}>
                        {docente.materias_asignadas || 0} materias asignadas
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {docente.grupos_asignados || 0} grupos asignados
                      </span>
                    </div>
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