export default function AlumnoList({ alumnos, onEdit, onDelete }) {
  if (alumnos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0h-15" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No hay alumnos registrados</h3>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          Comienza registrando nuevos estudiantes usando el botón "Nuevo Alumno"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado de la tabla */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-2xl border-2 border-cyan-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Lista de Alumnos</h2>
              <p className="text-gray-600">{alumnos.length} estudiantes registrados</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
            <span className="text-cyan-700 font-bold">{alumnos.length} registros</span>
          </div>
        </div>
      </div>

      {/* Tabla de alumnos */}
      <div className="overflow-x-auto bg-white rounded-2xl border-2 border-gray-100 shadow-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-6 px-8 text-gray-700 font-bold text-lg border-b-2 border-gray-200">
                Estudiante
              </th>
              <th className="text-left py-6 px-8 text-gray-700 font-bold text-lg border-b-2 border-gray-200">
                Información Académica
              </th>
              <th className="text-left py-6 px-8 text-gray-700 font-bold text-lg border-b-2 border-gray-200">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {alumnos.map((alumno) => (
              <tr key={alumno.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-6 px-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{alumno.nombre}</h4>
                      <div className="space-y-1 mt-2">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Matrícula:</span> {alumno.matricula}
                        </p>
                        {alumno.email && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Email:</span> {alumno.email}
                          </p>
                        )}
                        {alumno.telefono && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Teléfono:</span> {alumno.telefono}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-6 px-8">
                  <div className="space-y-3">
                    <div className="inline-flex items-center bg-cyan-50 px-4 py-2 rounded-lg">
                      <span className="text-cyan-800 font-bold mr-2">Cuatrimestre:</span>
                      <span className="text-cyan-900 font-bold text-lg">{alumno.cuatrimestre}</span>
                    </div>
                    
                    {alumno.asignaturas.length > 0 && (
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-2">Materias inscritas:</p>
                        <div className="flex flex-wrap gap-2">
                          {alumno.asignaturas.slice(0, 3).map((materia, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs">
                              {materia}
                            </span>
                          ))}
                          {alumno.asignaturas.length > 3 && (
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs">
                              +{alumno.asignaturas.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-6 px-8">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => onEdit(alumno)}
                      className="flex items-center justify-center px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-300 font-semibold"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(alumno.id)}
                      className="flex items-center justify-center px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 rounded-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 font-semibold"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estadísticas al final */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
            <p className="text-3xl font-bold text-cyan-700">{alumnos.length}</p>
            <p className="text-gray-700 font-medium">Total de alumnos</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <p className="text-3xl font-bold text-emerald-700">
              {[...new Set(alumnos.map(a => a.cuatrimestre))].length}
            </p>
            <p className="text-gray-700 font-medium">Cuatrimestres activos</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <p className="text-3xl font-bold text-amber-700">
              {alumnos.reduce((total, alumno) => total + alumno.asignaturas.length, 0)}
            </p>
            <p className="text-gray-700 font-medium">Total de inscripciones</p>
          </div>
        </div>
      </div>
    </div>
  );
}