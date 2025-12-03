import { useState, useEffect } from "react";

const materiasPorCuatrimestre = {
  1: ["Matemáticas I", "Programación I", "Inglés I"],
  2: ["Matemáticas II", "Programación II", "Inglés II"],
  3: ["Base de Datos I", "Cálculo", "Estructura de Datos"],
  4: ["Programación Orientada a Objetos", "Estadística", "Inglés III"],
  5: ["Sistemas Operativos", "Redes de Computadoras", "Ingeniería de Software"],
  6: ["Desarrollo Web", "Bases de Datos II", "Investigación de Operaciones"],
  7: ["Inteligencia Artificial", "Sistemas Distribuidos", "Ética Profesional"],
  8: ["Seguridad Informática", "Proyecto de Titulación I", "Seminario"],
  9: ["Proyecto de Titulación II", "Prácticas Profesionales"],
  10: ["Proyecto Final", "Seminario de Titulación"]
};

export default function AlumnoForm({ alumno, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: alumno?.id || null,
    nombre: alumno?.nombre || "",
    matricula: alumno?.matricula || "",
    cuatrimestre: alumno?.cuatrimestre || "",
    asignaturas: alumno?.asignaturas || [],
    email: alumno?.email || "",
    telefono: alumno?.telefono || ""
  });

  const [materiasDisponibles, setMateriasDisponibles] = useState([]);

  useEffect(() => {
    if (formData.cuatrimestre) {
      setMateriasDisponibles(materiasPorCuatrimestre[formData.cuatrimestre] || []);
    }
  }, [formData.cuatrimestre]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleMateriaToggle = (materia) => {
    const nuevasAsignaturas = formData.asignaturas.includes(materia)
      ? formData.asignaturas.filter(m => m !== materia)
      : [...formData.asignaturas, materia];
    
    setFormData({ ...formData, asignaturas: nuevasAsignaturas });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {alumno ? "Editar Alumno" : "Registrar Nuevo Alumno"}
        </h2>
        <p className="text-gray-600 text-lg">
          {alumno 
            ? "Modifica la información del estudiante" 
            : "Completa los datos para registrar un nuevo estudiante"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Información Personal */}
        <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Información Personal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Nombre Completo</label>
              <input
                type="text"
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez López"
                required
              />
            </div>

            {/* Matrícula */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Matrícula</label>
              <input
                type="text"
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                placeholder="Ej: A12345678"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Email</label>
              <input
                type="email"
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: estudiante@universidad.edu.mx"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Teléfono</label>
              <input
                type="tel"
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 5512345678"
              />
            </div>
          </div>
        </div>

        {/* Información Académica */}
        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-emerald-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Información Académica</h3>
          </div>

          {/* Cuatrimestre */}
          <div className="space-y-6 mb-8">
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">Cuatrimestre</label>
              <p className="text-gray-600 text-sm mb-3">
                Selecciona el cuatrimestre actual del estudiante
              </p>
              <select
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                value={formData.cuatrimestre}
                onChange={(e) =>
                  setFormData({ ...formData, cuatrimestre: Number(e.target.value), asignaturas: [] })
                }
                required
              >
                <option value="" className="text-gray-400">Selecciona un cuatrimestre</option>
                {[1,2,3,4,5,6,7,8,9,10].map((c) => (
                  <option key={c} value={c} className="text-gray-800">
                    Cuatrimestre {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Materias seleccionadas */}
            {formData.asignaturas.length > 0 && (
              <div className="bg-white p-6 rounded-xl border-2 border-emerald-200">
                <p className="text-emerald-800 font-semibold text-lg mb-3">Materias seleccionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.asignaturas.map((materia, index) => (
                    <span key={index} className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-medium">
                      {materia}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Materias Disponibles */}
          {formData.cuatrimestre && materiasDisponibles.length > 0 && (
            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg">Asignaturas a cursar</label>
              <p className="text-gray-600 text-sm mb-3">
                Selecciona las materias que el estudiante cursará este cuatrimestre (Ctrl+Click para múltiple)
              </p>
              <div className="bg-white border-2 border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto">
                {materiasDisponibles.map((materia) => (
                  <div 
                    key={materia} 
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${formData.asignaturas.includes(materia) ? 'bg-emerald-100 border-2 border-emerald-300' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => handleMateriaToggle(materia)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${formData.asignaturas.includes(materia) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400'}`}>
                        {formData.asignaturas.includes(materia) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`${formData.asignaturas.includes(materia) ? 'text-emerald-800 font-medium' : 'text-gray-700'}`}>
                        {materia}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="border-t-2 border-gray-300 my-6"></div>

        {/* Botones */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xl rounded-xl transition-all duration-300 border-2 border-cyan-700 hover:border-cyan-800 shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {alumno ? "Actualizar Alumno" : "Registrar Alumno"}
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