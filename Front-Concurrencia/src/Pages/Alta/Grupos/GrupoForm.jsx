import { useState, useEffect } from "react";

export default function GrupoForm({ grupo, materias, docentes, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: "",
    materia_id: "",
    docente_id: "",
    cupo_maximo: 25
  });

  const [errors, setErrors] = useState({});
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);

  // Inicializar formulario con datos del grupo si existe
  useEffect(() => {
    if (grupo) {
      setFormData({
        nombre: grupo.nombre || "",
        materia_id: grupo.materia_id || "",
        docente_id: grupo.docente_id || "",
        cupo_maximo: grupo.cupo_maximo || 25
      });

      // Buscar la materia seleccionada
      if (grupo.materia_id && materias) {
        const materia = materias.find(m => m.id === grupo.materia_id);
        setMateriaSeleccionada(materia);
      }

      // Buscar el docente seleccionado
      if (grupo.docente_id && docentes) {
        const docente = docentes.find(d => d.id === grupo.docente_id);
        setDocenteSeleccionado(docente);
      }
    }
  }, [grupo, materias, docentes]);

  // Actualizar materia seleccionada cuando cambia materia_id
  useEffect(() => {
    if (formData.materia_id && materias) {
      const materia = materias.find(m => m.id === formData.materia_id);
      setMateriaSeleccionada(materia);
    } else {
      setMateriaSeleccionada(null);
    }
  }, [formData.materia_id, materias]);

  // Actualizar docente seleccionado cuando cambia docente_id
  useEffect(() => {
    if (formData.docente_id && docentes) {
      const docente = docentes.find(d => d.id === formData.docente_id);
      setDocenteSeleccionado(docente);
    } else {
      setDocenteSeleccionado(null);
    }
  }, [formData.docente_id, docentes]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre del grupo
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del grupo es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar materia
    if (!formData.materia_id) {
      newErrors.materia_id = "Debe seleccionar una materia";
    }

    // Validar docente
    if (!formData.docente_id) {
      newErrors.docente_id = "Debe seleccionar un docente";
    }

    // Validar cupo máximo
    if (!formData.cupo_maximo || formData.cupo_maximo < 1) {
      newErrors.cupo_maximo = "El cupo máximo debe ser al menos 1";
    } else if (formData.cupo_maximo > 100) {
      newErrors.cupo_maximo = "El cupo máximo no puede exceder 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Si estamos editando, agregar el ID
      const dataToSave = grupo ? { ...formData, id: grupo.id } : formData;
      onSave(dataToSave);
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
      [name]: name === 'cupo_maximo' ? parseInt(value) || 25 : value
    }));
  };

  const handleCancel = () => {
    setErrors({});
    onCancel();
  };

  // Generar nombre sugerido basado en la materia seleccionada
  const generateSuggestedName = () => {
    if (!materiaSeleccionada) return "Nuevo Grupo";
    
    // Contar cuántos grupos ya existen para esta materia
    const gruposDeMateria = materias?.filter(m => m.id === materiaSeleccionada.id) || [];
    const nextNumber = gruposDeMateria.length + 1;
    
    return `${materiaSeleccionada.nombre} - Grupo ${nextNumber}`;
  };

  // Sugerir nombre cuando se selecciona una materia
  useEffect(() => {
    if (formData.materia_id && !formData.nombre.trim() && !grupo) {
      const suggestedName = generateSuggestedName();
      setFormData(prev => ({
        ...prev,
        nombre: suggestedName
      }));
    }
  }, [formData.materia_id, materiaSeleccionada]);

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
              <label className="block text-gray-800 font-semibold text-lg">
                Nombre del Grupo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.nombre ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                placeholder="Ej: Grupo A, Grupo Vespertino"
                required
                disabled={loading}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-2">{errors.nombre}</p>
              )}
            </div>

            {/* Materia */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Materia *
              </label>
              <select
                name="materia_id"
                value={formData.materia_id}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.materia_id ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm`}
                required
                disabled={loading}
              >
                <option value="" className="text-gray-400">Seleccione una materia</option>
                {Array.isArray(materias) && materias.map((materia) => (
                  <option key={materia.id} value={materia.id} className="text-gray-800">
                    {materia.nombre}
                  </option>
                ))}
              </select>
              {errors.materia_id && (
                <p className="text-red-500 text-sm mt-2">{errors.materia_id}</p>
              )}
            </div>

            {/* Docente */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Docente *
              </label>
              <select
                name="docente_id"
                value={formData.docente_id}
                onChange={handleChange}
                className={`w-full bg-white border-2 ${errors.docente_id ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm`}
                required
                disabled={loading}
              >
                <option value="" className="text-gray-400">Seleccione un docente</option>
                {Array.isArray(docentes) && docentes.map((docente) => (
                  <option key={docente.id} value={docente.id} className="text-gray-800">
                    {docente.nombre_completo}
                  </option>
                ))}
              </select>
              {errors.docente_id && (
                <p className="text-red-500 text-sm mt-2">{errors.docente_id}</p>
              )}
            </div>

            {/* Cupo Máximo */}
            <div className="space-y-3">
              <label className="block text-gray-800 font-semibold text-lg">
                Cupo Máximo *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="cupo_maximo"
                  value={formData.cupo_maximo}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className={`w-full bg-white border-2 ${errors.cupo_maximo ? 'border-red-300' : 'border-gray-300'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 hover:border-gray-400 transition-all duration-300 shadow-sm`}
                  required
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="font-medium">alumnos</span>
                </div>
              </div>
              {errors.cupo_maximo && (
                <p className="text-red-500 text-sm mt-2">{errors.cupo_maximo}</p>
              )}
              <p className="text-gray-500 text-sm">
                Recomendado: 25-30 alumnos para grupos estándar
              </p>
            </div>
          </div>
        </div>

        {/* Información de la Materia Seleccionada */}
        {materiaSeleccionada && (
          <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Información de la Materia</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Nombre</p>
                <p className="text-emerald-800 text-xl font-bold">{materiaSeleccionada.nombre}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Código</p>
                <p className="text-emerald-800 text-xl font-bold">{materiaSeleccionada.codigo || "N/A"}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Créditos</p>
                <p className="text-emerald-800 text-xl font-bold">{materiaSeleccionada.creditos || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Cuatrimestre</p>
                <p className="text-emerald-800 text-xl font-bold">{materiaSeleccionada.cuatrimestre_numero || "N/A"}</p>
              </div>
              {materiaSeleccionada.descripcion && (
                <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
                  <p className="text-gray-700 font-medium mb-2">Descripción</p>
                  <p className="text-emerald-800">{materiaSeleccionada.descripcion}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información del Docente Seleccionado */}
        {docenteSeleccionado && (
          <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-amber-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Información del Docente</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Nombre</p>
                <p className="text-amber-800 text-xl font-bold">{docenteSeleccionado.nombre_completo}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Email</p>
                <p className="text-amber-800 text-lg">{docenteSeleccionado.email || "N/A"}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Teléfono</p>
                <p className="text-amber-800 text-lg">{docenteSeleccionado.telefono || "N/A"}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium mb-2">Especialidad</p>
                <p className="text-amber-800 text-lg">{docenteSeleccionado.especialidad || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

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
              <p className="text-gray-700 font-medium mb-2">Materia</p>
              <p className="text-emerald-800 text-xl font-bold">
                {materiaSeleccionada?.nombre || "Sin materia seleccionada"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Docente</p>
              <p className="text-amber-800 text-xl font-bold">
                {docenteSeleccionado?.nombre_completo || "Sin docente seleccionado"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Cupo Máximo</p>
              <p className="text-cyan-800 text-2xl font-bold">{formData.cupo_maximo}</p>
            </div>
          </div>
        </div>

        {/* Nota sobre alumnos */}
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Información importante</h4>
              <p className="text-gray-600">
                Los alumnos se asignan al grupo después de crearlo. 
                Una vez guardado este formulario, podrás agregar alumnos al grupo 
                desde la opción "Asignar Alumnos" en la lista de grupos.
              </p>
              {grupo && (
                <p className="text-gray-600 mt-2">
                  Este grupo actualmente tiene {grupo.total_alumnos || 0} alumnos asignados.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t-2 border-gray-300 my-6"></div>

        {/* Botones */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-xl rounded-xl transition-all duration-300 border-2 border-violet-700 hover:border-violet-800 shadow-xl hover:shadow-violet-500/30 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                {grupo ? "Actualizando..." : "Creando..."}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={grupo ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
                {grupo ? "Actualizar Grupo" : "Crear Grupo"}
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