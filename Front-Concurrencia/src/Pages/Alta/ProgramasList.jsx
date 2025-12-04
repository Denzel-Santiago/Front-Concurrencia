import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {programasService} from "../../Services/programasService";
export default function ProgramasList() {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // Función para cargar programas
  const loadProgramas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await programasService.getAll();
      setProgramas(data);
    } catch (err) {
      console.error("Error al cargar programas:", err);
      setError(err.message || "No se pudieron cargar los programas");
      // Para desarrollo, usar datos de prueba si la API falla
      setProgramas(programasService.getMockData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgramas();
  }, []);

  // Función para eliminar programa
  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el programa "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await programasService.delete(id);
      
      // Eliminar localmente después de éxito en backend
      setProgramas(programas.filter(p => p.id !== id));
      
      // Mostrar mensaje de éxito
      alert(`Programa "${nombre}" eliminado exitosamente`);
    } catch (err) {
      console.error("Error al eliminar programa:", err);
      
      // Mensajes específicos según el error
      let errorMessage = err.message || "Error al eliminar el programa";
      
      // Verificar si es el error de cuatrimestres asociados
      if (err.message.includes("asociados") || err.message.includes("cuatrimestres")) {
        errorMessage = `No se puede eliminar el programa "${nombre}" porque tiene cuatrimestres asociados. Primero elimine los cuatrimestres del programa.`;
      }
      
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Si está cargando
  if (loading && programas.length === 0) {
    return (
      <div className="min-h-screen w-full bg-blue-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando programas...</p>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const totalProgramas = programas.length;
  const programasActivos = programas.filter(p => p.estado === 'Activo' || !p.estado).length;
  const programasInactivos = programas.filter(p => p.estado === 'Inactivo').length;

  return (
    <div className="min-h-screen w-full bg-blue-950 p-6">
      
      {/* Botón de regreso */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/alta')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-blue-200 hover:text-white rounded-lg transition-all duration-300 border border-blue-700 hover:border-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Volver al Módulo de Alta</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Programas de Estudio
        </h1>
        <p className="text-gray-300">
          Gestión de programas académicos registrados en el sistema
        </p>
        
        {/* Mensaje de error en header si existe */}
        {error && programas.length > 0 && (
          <div className="mt-4 p-3 bg-amber-900/30 border border-amber-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-amber-300 text-sm">
                {error} (mostrando datos locales)
              </span>
              <button 
                onClick={loadProgramas}
                className="ml-auto text-amber-400 hover:text-amber-300 text-sm underline"
              >
                Reintentar conexión
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barra de acciones y estadísticas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-900 rounded-lg">
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-blue-300 font-medium">Total de programas: {totalProgramas}</p>
            <div className="flex gap-3 text-sm">
              <span className="text-emerald-400">{programasActivos} activos</span>
              {programasInactivos > 0 && (
                <span className="text-red-400">{programasInactivos} inactivos</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {loading && programas.length > 0 && (
            <div className="flex items-center text-blue-300 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
              Actualizando...
            </div>
          )}
          
          <button
            onClick={() => navigate('/alta/programas/nuevo')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 border border-blue-600 hover:border-blue-500 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nuevo Programa</span>
          </button>
        </div>
      </div>

      {/* Tabla de programas */}
      <div className="bg-blue-900 rounded-xl border border-blue-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-800">
                <th className="text-left py-4 px-6 text-blue-300 font-semibold text-sm uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left py-4 px-6 text-blue-300 font-semibold text-sm uppercase tracking-wider">
                  Nombre del Programa
                </th>
                <th className="text-left py-4 px-6 text-blue-300 font-semibold text-sm uppercase tracking-wider">
                  Duración (Cuatrimestres)
                </th>
                <th className="text-left py-4 px-6 text-blue-300 font-semibold text-sm uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left py-4 px-6 text-blue-300 font-semibold text-sm uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-800">
              {programas.map((p) => (
                <tr key={p.id} className="hover:bg-blue-800/50 transition-colors">
                  <td className="py-4 px-6 text-blue-200 font-medium">
                    #{p.id.toString().padStart(3, '0')}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-medium">{p.nombre}</p>
                      <p className="text-blue-400 text-sm mt-1">Programa académico</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-24 bg-blue-800 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(p.cuatrimestres / 12) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium">{p.cuatrimestres} cuatrimestres</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      (p.estado === 'Activo' || !p.estado) 
                        ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700'
                        : p.estado === 'Inactivo'
                        ? 'bg-red-900/30 text-red-300 border-red-700'
                        : 'bg-amber-900/30 text-amber-300 border-amber-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        (p.estado === 'Activo' || !p.estado) 
                          ? 'bg-emerald-400'
                          : p.estado === 'Inactivo'
                          ? 'bg-red-400'
                          : 'bg-amber-400'
                      }`}></div>
                      {p.estado || 'Activo'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/alta/programas/${p.id}/editar`)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Editar"
                        disabled={deletingId === p.id}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(p.id, p.nombre)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar"
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => navigate(`/alta/programas/${p.id}/detalle`)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Ver detalles"
                        disabled={deletingId === p.id}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje si no hay programas */}
        {programas.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-blue-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No hay programas registrados</p>
            <p className="text-gray-500 mt-2">Comienza creando un nuevo programa de estudio</p>
            <button
              onClick={() => navigate('/alta/programas/nuevo')}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Crear Primer Programa
            </button>
          </div>
        )}
      </div>

      {/* Footer con información y paginación */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-blue-300">
          <p className="text-sm">Mostrando {programas.length} programa{programas.length !== 1 ? 's' : ''}</p>
          {error && programas.length > 0 && (
            <p className="text-amber-400 text-sm mt-1">
              {error} (mostrando datos locales)
            </p>
          )}
        </div>
        
        {/* Paginación simple */}
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-blue-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={programas.length === 0}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="px-3 py-1 bg-blue-800 rounded-lg">1</span>
          <button 
            className="p-2 hover:bg-blue-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={programas.length === 0}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}