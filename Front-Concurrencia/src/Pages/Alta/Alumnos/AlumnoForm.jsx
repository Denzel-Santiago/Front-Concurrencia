import { useState, useEffect } from "react";

export default function AlumnoForm({ alumno, programas, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    matricula: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    programa_id: "",
    cuatrimestre_actual: 1
  });

  const [errors, setErrors] = useState({});
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);

  // Inicializar formulario con datos del alumno si existe
  useEffect(() => {
    if (alumno) {
      setFormData({
        nombre_completo: alumno.nombre_completo || "",
        matricula: alumno.matricula || "",
        email: alumno.email || "",
        telefono: alumno.telefono || "",
        fecha_nacimiento: alumno.fecha_nacimiento 
          ? new Date(alumno.fecha_nacimiento).toISOString().split('T')[0]
          : "",
        programa_id: alumno.programa_id || "",
        cuatrimestre_actual: alumno.cuatrimestre_actual || 1
      });

      // Buscar el programa seleccionado para mostrar el total de cuatrimestres
      if (alumno.programa_id && programas) {
        const programa = programas.find(p => p.id === alumno.programa_id);
        setProgramaSeleccionado(programa);
      }
    }
  }, [alumno, programas]);

  // Actualizar programa seleccionado cuando cambia programa_id
  useEffect(() => {
    if (formData.programa_id && programas) {
      const programa = programas.find(p => p.id === formData.programa_id);
      setProgramaSeleccionado(programa);
      
      // Si el cuatrimestre actual es mayor que el total del programa, ajustarlo
      if (programa && formData.cuatrimestre_actual > programa.cuatrimestres_totales) {
        setFormData(prev => ({
          ...prev,
          cuatrimestre_actual: programa.cuatrimestres_totales
        }));
      }
    } else {
      setProgramaSeleccionado(null);
    }
  }, [formData.programa_id, formData.cuatrimestre_actual, programas]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre completo
    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = "El nombre completo es obligatorio";
    } else if (formData.nombre_completo.trim().length < 3) {
      newErrors.nombre_completo = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar matrícula
    if (!formData.matricula.trim()) {
      newErrors.matricula = "La matrícula es obligatoria";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar teléfono (opcional, pero si se ingresa debe ser válido)
    const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (formData.telefono && !telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = "El teléfono no es válido";
    }

    // Validar fecha de nacimiento
    if (formData.fecha_nacimiento) {
      const fechaNacimiento = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      if (fechaNacimiento > hoy) {
        newErrors.fecha_nacimiento = "La fecha de nacimiento no puede ser futura";
      }
      
      // Calcular edad mínima (15 años)
      const edadMinima = new Date();
      edadMinima.setFullYear(edadMinima.getFullYear() - 15);
      if (fechaNacimiento > edadMinima) {
        newErrors.fecha_nacimiento = "El alumno debe tener al menos 15 años";
      }
    }

    // Validar programa
    if (!formData.programa_id) {
      newErrors.programa_id = "Debe seleccionar un programa";
    }

    // Validar cuatrimestre
    if (!formData.cuatrimestre_actual || formData.cuatrimestre_actual < 1) {
      newErrors.cuatrimestre_actual = "El cuatrimestre debe ser al menos 1";
    } else if (programaSeleccionado && formData.cuatrimestre_actual > programaSeleccionado.cuatrimestres_totales) {
      newErrors.cuatrimestre_actual = `El cuatrimestre no puede ser mayor a ${programaSeleccionado.cuatrimestres_totales} (total del programa)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'cuatrimestre_actual' ? parseInt(value) || 1 : value
    }));
  };

  const handleCancel = () => {
    setErrors({});
    onCancel();
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
        
        {/* Mensaje de error general */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-600 font-medium">Por favor corrige los siguientes errores:</p>
                <ul className="list-disc list-inside text-red-500 text-sm mt-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

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
            {/* Nombre Completo */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.nombre_completo ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                placeholder="Ej: Juan Pérez López"
                required
                disabled={loading}
              />
              {errors.nombre_completo && (
                <p className="text-red-500 text-sm mt-2">{errors.nombre_completo}</p>
              )}
            </div>

            {/* Matrícula */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Matrícula *
              </label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.matricula ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                placeholder="Ej: A12345678"
                required
                disabled={loading}
              />
              {errors.matricula && (
                <p className="text-red-500 text-sm mt-2">{errors.matricula}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                placeholder="Ej: estudiante@universidad.edu.mx"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.telefono ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                placeholder="Ej: 5512345678"
                disabled={loading}
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-2">{errors.telefono}</p>
              )}
            </div>

            {/* Fecha de Nacimiento */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.fecha_nacimiento ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
              {errors.fecha_nacimiento ? (
                <p className="text-red-500 text-sm mt-2">{errors.fecha_nacimiento}</p>
              ) : (
                <p className="text-gray-500 text-sm mt-2">Formato: DD/MM/AAAA</p>
              )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Programa */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Programa Académico *
              </label>
              <select
                name="programa_id"
                value={formData.programa_id}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.programa_id ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm`}
                required
                disabled={loading}
              >
                <option value="" className="text-gray-400">Selecciona un programa</option>
                {Array.isArray(programas) && programas.map((programa) => (
                  <option key={programa.id} value={programa.id} className="text-gray-800">
                    {programa.nombre}
                  </option>
                ))}
              </select>
              {errors.programa_id && (
                <p className="text-red-500 text-sm mt-2">{errors.programa_id}</p>
              )}
            </div>

            {/* Cuatrimestre Actual */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Cuatrimestre Actual *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="cuatrimestre_actual"
                  value={formData.cuatrimestre_actual}
                  onChange={handleChange}
                  min="1"
                  max={programaSeleccionado?.cuatrimestres_totales || 10}
                  className={`w-full bg-white border-2 ${errors.cuatrimestre_actual ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                  required
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="font-medium">
                    / {programaSeleccionado?.cuatrimestres_totales || "?"}
                  </span>
                </div>
              </div>
              {errors.cuatrimestre_actual && (
                <p className="text-red-500 text-sm mt-2">{errors.cuatrimestre_actual}</p>
              )}
              {programaSeleccionado && (
                <p className="text-gray-600 text-sm mt-2">
                  Total de cuatrimestres en {programaSeleccionado.nombre}: {programaSeleccionado.cuatrimestres_totales}
                </p>
              )}
            </div>
          </div>

          {/* Información del programa seleccionado */}
          {programaSeleccionado && (
            <div className="mt-6 bg-white p-6 rounded-xl border-2 border-emerald-200">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    Información del Programa
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm block">Nombre:</span>
                      <p className="font-medium">{programaSeleccionado.nombre}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm block">Total de cuatrimestres:</span>
                      <p className="font-medium">{programaSeleccionado.cuatrimestres_totales}</p>
                    </div>
                    {programaSeleccionado.descripcion && (
                      <div className="md:col-span-2">
                        <span className="text-gray-600 text-sm block">Descripción:</span>
                        <p className="font-medium text-sm">{programaSeleccionado.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>
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
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xl rounded-xl transition-all duration-300 border-2 border-cyan-700 hover:border-cyan-800 shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                {alumno ? "Actualizando..." : "Registrando..."}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {alumno ? "Actualizar Alumno" : "Registrar Alumno"}
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-12 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}