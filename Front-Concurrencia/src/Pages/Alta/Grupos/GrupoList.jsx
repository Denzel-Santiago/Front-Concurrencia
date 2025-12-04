import { useState } from "react";

export default function GrupoList({ grupos, onEdit, onDelete, loading }) {
  // Estado para grupos expandidos (para mostrar alumnos)
  const [expandedId, setExpandedId] = useState(null);
  // Estado para grupos con estadísticas cargadas
  const [estadisticasGrupo, setEstadisticasGrupo] = useState({});

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        <p className="mt-4 text-gray-600">Cargando grupos...</p>
      </div>
    );
  }

  if (!grupos || grupos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No hay grupos registrados</h3>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          Comienza creando nuevos grupos académicos usando el botón "Nuevo Grupo"
        </p>
      </div>
    );
  }

  // Calcular estadísticas generales
  const calcularEstadisticasGenerales = () => {
    const totalGrupos = grupos.length;
    const materiasUnicas = new Set(grupos.map(g => g.materia_id)).size;
    const totalAlumnos = grupos.reduce((total, grupo) => total + (grupo.total_alumnos || 0), 0);
    
    let porcentajeOcupacionTotal = 0;
    let gruposConCupo = 0;
    
    grupos.forEach(grupo => {
      if (grupo.cupo_maximo && grupo.total_alumnos !== undefined) {
        const porcentaje = (grupo.total_alumnos / grupo.cupo_maximo) * 100;
        porcentajeOcupacionTotal += porcentaje;
        gruposConCupo++;
      }
    });

    const ocupacionPromedio = gruposConCupo > 0 
      ? (porcentajeOcupacionTotal / gruposConCupo).toFixed(1)
      : 0;

    return {
      totalGrupos,
      materiasUnicas,
      totalAlumnos,
      ocupacionPromedio
    };
  };

  const estadisticasGenerales = calcularEstadisticasGenerales();

  // Calcular porcentaje de ocupación para un grupo
  const calcularPorcentajeOcupacion = (grupo) => {
    if (!grupo.cupo_maximo || !grupo.total_alumnos) return 0;
    return Math.round((grupo.total_alumnos / grupo.cupo_maximo) * 100);
  };

  // Determinar color según porcentaje de ocupación
  const getColorOcupacion = (porcentaje) => {
    if (porcentaje < 60) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (porcentaje < 90) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const toggleExpand = (grupo) => {
    setExpandedId(expandedId === grupo.id ? null : grupo.id);
  };

  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "No disponible";
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de la tabla */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-2xl border-2 border-violet-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Lista de Grupos</h2>
              <p className="text-gray-600">
                {estadisticasGenerales.totalGrupos} grupos académicos registrados
              </p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
            <span className="text-violet-700 font-bold">{estadisticasGenerales.totalGrupos} registros</span>
          </div>
        </div>
      </div>

      {/* Grid de grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((grupo) => {
          const porcentajeOcupacion = calcularPorcentajeOcupacion(grupo);
          const colorOcupacion = getColorOcupacion(porcentajeOcupacion);
          
          return (
            <div
              key={grupo.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-violet-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{grupo.nombre}</h3>
                    <p className="text-gray-600 text-sm">ID: {grupo.id}</p>
                  </div>
                </div>
                <span className="bg-violet-100 text-violet-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {grupo.total_alumnos || 0} / {grupo.cupo_maximo || 0}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {/* Información de materia */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="font-medium text-gray-700">Materia</p>
                  </div>
                  <p className="text-gray-800 font-semibold text-lg">{grupo.materia_nombre || "Sin materia asignada"}</p>
                  {grupo.materia_codigo && (
                    <p className="text-gray-600 text-sm mt-1">Código: {grupo.materia_codigo}</p>
                  )}
                  {grupo.cuatrimestre_numero && (
                    <p className="text-gray-600 text-sm">Cuatrimestre: {grupo.cuatrimestre_numero}</p>
                  )}
                </div>

                {/* Información de docente */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="font-medium text-amber-700">Docente</p>
                  </div>
                  <p className="text-amber-800 font-semibold text-lg">{grupo.docente_nombre || "Sin docente asignado"}</p>
                  {grupo.docente_email && (
                    <p className="text-amber-700 text-sm mt-1">{grupo.docente_email}</p>
                  )}
                </div>

                {/* Información de cupo y ocupación */}
                <div className={`p-4 rounded-xl border ${colorOcupacion}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="font-medium">Ocupación</p>
                    </div>
                    <span className="font-bold text-lg">{porcentajeOcupacion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${porcentajeOcupacion < 60 ? 'bg-emerald-500' : porcentajeOcupacion < 90 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(porcentajeOcupacion, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-2">
                    {grupo.total_alumnos || 0} alumnos de {grupo.cupo_maximo || 0} cupos disponibles
                  </p>
                </div>

                {/* Información de creación */}
                {grupo.created_at && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-blue-800 text-sm">Creado el {formatFecha(grupo.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(grupo)}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(grupo.id)}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 rounded-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || (grupo.total_alumnos && grupo.total_alumnos > 0)}
                    title={grupo.total_alumnos > 0 ? "No se puede eliminar porque tiene alumnos inscritos" : ""}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
                
                <button
                  onClick={() => toggleExpand(grupo)}
                  className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 font-semibold"
                >
                  <svg className={`w-5 h-5 mr-2 transform transition-transform ${expandedId === grupo.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {expandedId === grupo.id ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
              </div>

              {/* Detalles expandidos */}
              {expandedId === grupo.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Información detallada</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Información del programa */}
                    {grupo.programa_nombre && (
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="text-indigo-800 text-sm font-medium mb-1">Programa académico</p>
                        <p className="text-indigo-900 font-bold">{grupo.programa_nombre}</p>
                      </div>
                    )}

                    {/* Créditos de la materia */}
                    {grupo.creditos && (
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <p className="text-green-800 text-sm font-medium mb-1">Créditos</p>
                        <p className="text-green-900 font-bold">{grupo.creditos} créditos</p>
                      </div>
                    )}

                    {/* ID de Moodle */}
                    {grupo.curso_moodle_id && (
                      <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                        <p className="text-cyan-800 text-sm font-medium mb-1">ID de Moodle</p>
                        <p className="text-cyan-900 font-bold">{grupo.curso_moodle_id}</p>
                      </div>
                    )}
                  </div>

                  {/* Información de alumnos */}
                  <div className="mt-4">
                    <p className="text-gray-700 font-medium mb-2">
                      Alumnos inscritos: {grupo.total_alumnos || 0}
                    </p>
                    {grupo.total_alumnos > 0 ? (
                      <p className="text-gray-600 text-sm">
                        Para ver la lista completa de alumnos, edita el grupo.
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm">
                        No hay alumnos inscritos en este grupo.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Estadísticas al final */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
            <p className="text-3xl font-bold text-violet-700">{estadisticasGenerales.totalGrupos}</p>
            <p className="text-gray-700 font-medium">Total de grupos</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <p className="text-3xl font-bold text-emerald-700">{estadisticasGenerales.materiasUnicas}</p>
            <p className="text-gray-700 font-medium">Materias diferentes</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <p className="text-3xl font-bold text-amber-700">{estadisticasGenerales.totalAlumnos}</p>
            <p className="text-gray-700 font-medium">Total de alumnos</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
            <p className="text-3xl font-bold text-cyan-700">{estadisticasGenerales.ocupacionPromedio}%</p>
            <p className="text-gray-700 font-medium">Ocupación promedio</p>
          </div>
        </div>
      </div>
    </div>
  );
}