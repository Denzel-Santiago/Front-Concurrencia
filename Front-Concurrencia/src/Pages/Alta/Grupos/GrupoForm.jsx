import { useState } from "react";

// Datos de ejemplo mejorados
const materias = [
  "Matemáticas I", 
  "Programación I", 
  "Estructuras de Datos",
  "Base de Datos I",
  "Cálculo Diferencial",
  "Álgebra Lineal",
  "Física General",
  "Inglés I"
];

const docentes = [
  "Dr. Juan Pérez López",
  "Mtra. María González Ruiz",
  "Ing. Carlos Ortega Mendoza",
  "Lic. Ana Torres Sánchez",
  "Dra. Sofía Ramírez Vargas"
];

const alumnosFake = [
  "Carlos Martínez García",
  "Ana López Hernández",
  "Miguel Ángel Torres",
  "Sofía Ramírez Vargas",
  "Jorge González Ruiz",
  "María Fernanda Díaz",
  "Luis Alberto Sánchez",
  "Patricia Ortega Mendoza",
  "Ricardo Jiménez Castro",
  "Laura Silva Rojas"
];

export default function GrupoForm({ grupo, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: grupo?.id || null,
    nombre: grupo?.nombre || "",
    asignatura: grupo?.asignatura || "",
    docente: grupo?.docente || "",
    alumnos: grupo?.alumnos || [],
    horario: grupo?.horario || "Lunes y Miércoles 10:00-12:00",
    aula: grupo?.aula || "Aula 101"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAlumnoToggle = (alumno) => {
    const nuevosAlumnos = formData.alumnos.includes(alumno)
      ? formData.alumnos.filter(a => a !== alumno)
      : [...formData.alumnos, alumno];
    
    setFormData({ ...formData, alumnos: nuevosAlumnos });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {grupo ? "Editar Grupo" : "Registrar Nuevo Grupo"}
        </h2>
        <p className="text-gray-600 text-lg">
          {grupo 
            ? "Modifica la información del grupo académico" 
            : "Completa los datos para crear un nuevo grupo académico"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Información Básica del Grupo */}
        <div className="bg-violet-50 p-8 rounded-2xl border border-violet-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-violet-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Información Básica del Grupo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Grupo */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Nombre del Grupo</label>
              <input
                type="text"
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Grupo A, Grupo Vespertino"
                required
              />
            </div>

            {/* Asignatura */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Asignatura</label>
              <select
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                value={formData.asignatura}
                onChange={(e) => setFormData({ ...formData, asignatura: e.target.value })}
                required
              >
                <option value="" className="text-gray-400">Seleccione una asignatura</option>
                {materias.map((m) => (
                  <option key={m} value={m} className="text-gray-800">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Docente */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Docente</label>
              <select
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                value={formData.docente}
                onChange={(e) => setFormData({ ...formData, docente: e.target.value })}
                required
              >
                <option value="" className="text-gray-400">Seleccione un docente</option>
                {docentes.map((d) => (
                  <option key={d} value={d} className="text-gray-800">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Horario */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Horario</label>
              <input
                type="text"
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                placeholder="Ej: Lunes y Miércoles 10:00-12:00"
              />
            </div>
          </div>

          {/* Aula */}
          <div className="mt-6 space-y-3">
            <label className="block text-gray-800 font-semibold text-lg">Aula o Salón</label>
            <input
              type="text"
              className="w-full max-w-xs bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
              value={formData.aula}
              onChange={(e) => setFormData({ ...formData, aula: e.target.value })}
              placeholder="Ej: Aula 101, Laboratorio 3"
            />
          </div>
        </div>

        {/* Asignación de Alumnos */}
        <div className="bg-cyan-50 p-8 rounded-2xl border border-cyan-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-cyan-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0h-15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Asignación de Alumnos</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Seleccionar Alumnos</label>
              <p className="text-gray-600 text-sm mb-3">
                Selecciona los alumnos que formarán parte de este grupo (Ctrl+Click para múltiple)
              </p>
              
              {/* Alumnos seleccionados */}
              {formData.alumnos.length > 0 && (
                <div className="mb-6 bg-white p-6 rounded-xl border-2 border-cyan-200">
                  <p className="text-cyan-800 font-semibold text-lg mb-3">
                    Alumnos seleccionados: <span className="text-cyan-900">{formData.alumnos.length}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.alumnos.map((alumno, index) => (
                      <span 
                        key={index} 
                        className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        {alumno}
                        <button
                          type="button"
                          onClick={() => handleAlumnoToggle(alumno)}
                          className="text-cyan-600 hover:text-cyan-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de alumnos disponibles */}
              <div className="bg-white border-2 border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto">
                {alumnosFake.map((alumno) => (
                  <div 
                    key={alumno} 
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${formData.alumnos.includes(alumno) ? 'bg-cyan-100 border-2 border-cyan-300' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => handleAlumnoToggle(alumno)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${formData.alumnos.includes(alumno) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-400'}`}>
                        {formData.alumnos.includes(alumno) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`${formData.alumnos.includes(alumno) ? 'text-cyan-800 font-medium' : 'text-gray-700'}`}>
                        {alumno}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen del Grupo */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-8 rounded-2xl border-2 border-violet-200">
          <div className="flex items-center mb-6">
            <svg className="w-7 h-7 text-violet-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Resumen del Grupo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Nombre del Grupo</p>
              <p className="text-violet-800 text-xl font-bold">{formData.nombre || "Sin nombre"}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Asignatura</p>
              <p className="text-violet-800 text-xl font-bold">{formData.asignatura || "Sin asignatura"}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Docente</p>
              <p className="text-amber-800 text-xl font-bold">{formData.docente || "Sin docente"}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Total de Alumnos</p>
              <p className="text-cyan-800 text-2xl font-bold">{formData.alumnos.length}</p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t-2 border-gray-300 my-6"></div>

        {/* Botones */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-xl rounded-xl transition-all duration-300 border-2 border-violet-700 hover:border-violet-800 shadow-xl hover:shadow-violet-500/30 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={grupo ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
              </svg>
              {grupo ? "Actualizar Grupo" : "Registrar Grupo"}
            </div>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-12 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 text-xl font-semibold"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}