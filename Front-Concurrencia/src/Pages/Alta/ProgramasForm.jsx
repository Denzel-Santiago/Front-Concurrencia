import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProgramasForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    cuatrimestres: 10,
    descripcion: "",
    estado: "Activo"
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadPrograma();
    }
  }, [id]);

  const loadPrograma = async () => {
    try {
      setLoading(true);
      const programaEjemplo = {
        id: id,
        nombre: "Ingeniería en Sistemas",
        cuatrimestres: 10,
        descripcion: "Programa de ingeniería en sistemas computacionales",
        estado: "Activo"
      };
      setFormData(programaEjemplo);
    } catch (error) {
      console.error("Error al cargar programa:", error);
      alert("Error al cargar los datos del programa");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cuatrimestres' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        console.log("Editando programa:", { id, ...formData });
        alert("Programa actualizado exitosamente");
      } else {
        console.log("Creando programa:", formData);
        alert("Programa creado exitosamente");
      }
      
      navigate("/alta/programas");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-950 p-4">
      
      {/* Botón de regreso ROJO en esquina superior izquierda */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/alta/programas')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 border border-red-700 hover:border-red-500 shadow-md hover:shadow-red-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Volver</span>
        </button>
      </div>

      {/* Header CENTRADO */}
      <div className="text-center mb-10 pt-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {isEditing ? "Editar Programa" : "Nuevo Programa de Estudio"}
        </h1>
        <p className="text-gray-300 text-lg">
          {isEditing 
            ? "Modifica la información del programa académico" 
            : "Completa los datos para registrar un nuevo programa académico"
          }
        </p>
      </div>

      {/* Formulario CENTRADO y con buen espaciado */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            
            {loading && isEditing ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-6 text-lg">Cargando datos del programa...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* Campo: Nombre */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-800 font-semibold text-lg mb-2">
                      Nombre del Programa
                    </label>
                    <p className="text-gray-600 text-sm mb-3">
                      Ingresa el nombre completo del programa académico
                    </p>
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-black rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
                    placeholder="Descripcion"
                  />
                </div>

                {/* Campo: Cuatrimestres */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-800 font-semibold text-lg mb-2">
                      Duración del Programa
                    </label>
                    <p className="text-gray-600 text-sm mb-3">
                      Especifica la duración total en cuatrimestres
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="cuatrimestres"
                      min="1"
                      max="16"
                      value={formData.cuatrimestres}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-black rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors appearance-none"
                    />
                   
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Duración seleccionada:</span>
                      <span className="text-blue-600 font-bold text-lg">{formData.cuatrimestres} cuatrimestres</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(formData.cuatrimestres / 16) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-3">
                      Duración recomendada: 8-12 cuatrimestres
                    </p>
                  </div>
                </div>

                {/* Campo: Descripción */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-800 font-semibold text-lg mb-2">
                      Descripción del Programa
                    </label>
                    
                  </div>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-white border border-black rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors resize-none"
                    placeholder="Descripcion"
                  />
                </div>

                {/* Campo: Estado (solo para edición) */}
                {isEditing && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-800 font-semibold text-lg mb-2">
                        Estado del Programa
                      </label>
                      <p className="text-gray-600 text-sm mb-3">
                        Selecciona el estado actual del programa académico
                      </p>
                    </div>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Activo">Activo - Programa disponible para nuevos estudiantes</option>
                      <option value="Inactivo">Inactivo - Programa no disponible temporalmente</option>
                      <option value="En revisión">En revisión - Programa en proceso de actualización</option>
                    </select>
                  </div>
                )}

            

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-lg rounded-xl transition-all duration-300 border border-blue-700 hover:border-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[250px] shadow-lg hover:shadow-blue-500/30"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        <span className="text-lg">{isEditing ? "Guardando..." : "Creando..."}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                        </svg>
                        <span className="text-lg">{isEditing ? "Actualizar Programa" : "Crear Programa"}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/alta/programas')}
                    className="px-10 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 rounded-xl transition-all duration-300 border border-gray-300 hover:border-gray-400 min-w-[250px] text-lg"
                  >
                    Cancelar
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}