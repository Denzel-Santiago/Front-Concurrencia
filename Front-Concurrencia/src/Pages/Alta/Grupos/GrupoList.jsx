export default function GrupoList({ grupos, onEdit, onDelete }) {
  if (grupos.length === 0) {
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
                {grupos.length} grupos académicos registrados
              </p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
            <span className="text-violet-700 font-bold">{grupos.length} registros</span>
          </div>
        </div>
      </div>

      {/* Grid de grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((grupo) => (
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
                  <p className="text-gray-600 text-sm">Grupo académico</p>
                </div>
              </div>
              <span className="bg-violet-100 text-violet-800 text-sm font-semibold px-3 py-1 rounded-full">
                {grupo.alumnos.length} alumnos
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {/* Información de asignatura */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="font-medium text-gray-700">Asignatura</p>
                </div>
                <p className="text-gray-800 font-semibold text-lg">{grupo.asignatura}</p>
              </div>

              {/* Información de docente */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="font-medium text-amber-700">Docente</p>
                </div>
                <p className="text-amber-800 font-semibold text-lg">{grupo.docente}</p>
              </div>

              {/* Alumnos destacados */}
              {grupo.alumnos.length > 0 && (
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0h-15" />
                      </svg>
                      <p className="font-medium text-cyan-700">Alumnos destacados</p>
                    </div>
                    <span className="text-cyan-800 font-bold">{grupo.alumnos.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {grupo.alumnos.slice(0, 3).map((alumno, index) => (
                      <span key={index} className="bg-white text-cyan-700 text-sm px-3 py-1 rounded-lg border border-cyan-200">
                        {alumno}
                      </span>
                    ))}
                    {grupo.alumnos.length > 3 && (
                      <span className="bg-cyan-100 text-cyan-800 text-sm px-3 py-1 rounded-lg">
                        +{grupo.alumnos.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(grupo)}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-300 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => onDelete(grupo.id)}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 rounded-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas al final */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
            <p className="text-3xl font-bold text-violet-700">{grupos.length}</p>
            <p className="text-gray-700 font-medium">Total de grupos</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <p className="text-3xl font-bold text-emerald-700">
              {[...new Set(grupos.map(g => g.asignatura))].length}
            </p>
            <p className="text-gray-700 font-medium">Materias diferentes</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <p className="text-3xl font-bold text-amber-700">
              {grupos.reduce((total, grupo) => total + grupo.alumnos.length, 0)}
            </p>
            <p className="text-gray-700 font-medium">Total de alumnos</p>
          </div>
        </div>
      </div>
    </div>
  );
}