import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlumnoList from "./AlumnoList";
import AlumnoForm from "./AlumnoForm";
import { alumnosService } from "../../../Services/alumnos.service";
import { programasService } from "../../../Services/programasService";

export default function Alumnos() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroCuatrimestre, setFiltroCuatrimestre] = useState("");

  // Cargar programas y alumnos al iniciar
  useEffect(() => {
    loadProgramas();
    loadAlumnos();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    const timer = setTimeout(() => {
      aplicarFiltros();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [busqueda, filtroPrograma, filtroCuatrimestre]);

  const loadProgramas = async () => {
    try {
      const data = await programasService.getAll();
      setProgramas(data || []);
    } catch (err) {
      console.error("Error al cargar programas:", err);
      setError("Error al cargar los programas");
      setProgramas([]);
    }
  };

  const loadAlumnos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alumnosService.getAll();
      setAlumnos(data || []);
    } catch (err) {
      console.error("Error al cargar alumnos:", err);
      setError("Error al cargar los alumnos");
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      
      // Si hay algún filtro activo, usar filtros combinados
      if (busqueda.trim() !== "" || filtroPrograma || filtroCuatrimestre) {
        data = await alumnosService.getWithFilters({
          programaId: filtroPrograma,
          cuatrimestre: filtroCuatrimestre,
          search: busqueda.trim()
        });
      } else {
        // Si no hay filtros, cargar todos
        data = await alumnosService.getAll();
      }
      
      setAlumnos(data || []);
    } catch (err) {
      console.error("Error al aplicar filtros:", err);
      setError("Error al aplicar filtros");
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAlumno(null);
    setShowForm(true);
  };

  const handleEdit = (alumno) => {
    setEditingAlumno(alumno);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este alumno?\n\n⚠️ No se podrá eliminar si tiene inscripciones activas.")) {
      return;
    }

    try {
      const result = await alumnosService.delete(id);
      if (result.success) {
        // Recargar la lista después de eliminar
        loadAlumnos();
      } else {
        setError(result.message || "Error al eliminar el alumno. Posiblemente tiene inscripciones activas.");
      }
    } catch (err) {
      console.error("Error al eliminar alumno:", err);
      setError("Error de conexión al eliminar alumno");
    }
  };

  const handleSave = async (alumnoData) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (alumnoData.id) {
        // Editar alumno existente
        result = await alumnosService.update(alumnoData.id, alumnoData);
      } else {
        // Crear nuevo alumno
        result = await alumnosService.create(alumnoData);
      }

      if (result.success) {
        setShowForm(false);
        loadAlumnos(); // Recargar la lista
      } else {
        setError(result.message || "Error al guardar el alumno");
      }
    } catch (err) {
      console.error("Error al guardar alumno:", err);
      setError("Error de conexión al guardar alumno");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAlumno(null);
    setError(null);
  };

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    if (!Array.isArray(alumnos) || alumnos.length === 0) {
      return {
        total: 0,
        programas: {},
        cuatrimestres: new Set(),
        promedioInscripciones: 0
      };
    }

    const programasCount = {};
    const cuatrimestresSet = new Set();
    let totalInscripciones = 0;

    alumnos.forEach(alumno => {
      // Conteo por programa
      const programa = alumno.programa_nombre || "Sin programa";
      programasCount[programa] = (programasCount[programa] || 0) + 1;

      // Cuatrimestres únicos
      if (alumno.cuatrimestre_actual) {
        cuatrimestresSet.add(alumno.cuatrimestre_actual);
      }

      // Total inscripciones
      totalInscripciones += alumno.inscripciones_activas || 0;
    });

    return {
      total: alumnos.length,
      programas: programasCount,
      cuatrimestres: cuatrimestresSet.size,
      promedioInscripciones: (totalInscripciones / alumnos.length).toFixed(1)
    };
  };

  const estadisticas = calcularEstadisticas();

  return (
    <div className="min-h-screen w-full bg-blue-950 p-4 md:p-8">
      
      {/* Botón de regreso */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/alta')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 border border-red-700 hover:border-red-500 shadow-lg hover:shadow-red-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Volver</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12 pt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Gestión de Alumnos
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Administra el registro y seguimiento de estudiantes académicos
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          
          {/* SECCIÓN SUPERIOR CON FILTROS Y ESTADÍSTICAS */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center w-full lg:w-auto">
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl shadow-md mr-6">
                  <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0h-15" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Registro de Estudiantes
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-600">{estadisticas.total}</p>
                      <p className="text-gray-600 text-sm">Alumnos registrados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{estadisticas.cuatrimestres}</p>
                      <p className="text-gray-600 text-sm">Cuatrimestres activos</p>
                    </div>
                  </div>
                </div>
              </div>

              {!showForm && (
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 border-2 border-cyan-700 hover:border-cyan-800 shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nuevo Alumno
                  </div>
                </button>
              )}
            </div>

            {/* Filtros de búsqueda */}
            {!showForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda por texto */}
                <div className="relative">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Buscar por nombre, matrícula o email..."
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filtro por programa */}
                <div>
                  <select
                    value={filtroPrograma}
                    onChange={(e) => setFiltroPrograma(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  >
                    <option value="">Todos los programas</option>
                    {Array.isArray(programas) && programas.map((p) => (
                      <option key={p?.id} value={p?.id}>
                        {p?.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por cuatrimestre */}
                <div>
                  <select
                    value={filtroCuatrimestre}
                    onChange={(e) => setFiltroCuatrimestre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  >
                    <option value="">Todos los cuatrimestres</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        Cuatrimestre {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* CONTENIDO DINÁMICO */}
          {loading && !showForm ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-2xl">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              <p className="mt-4 text-gray-600">Cargando alumnos...</p>
            </div>
          ) : showForm ? (
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
              <AlumnoForm 
                alumno={editingAlumno} 
                programas={programas}
                onSave={handleSave} 
                onCancel={handleCancel}
                loading={loading}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
              <AlumnoList 
                alumnos={alumnos} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                loading={loading}
              />
            </div>
          )}

          {/* SECCIÓN DE INFORMACIÓN */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100 mt-8">
            <div className="text-center mb-12">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Información sobre alumnos</h4>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Datos importantes sobre la gestión de estudiantes académicos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0h-15",
                  title: "Registro completo",
                  desc: "Captura información personal, académica y de contacto del estudiante"
                },
                {
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                  title: "Asignación académica",
                  desc: "Asigna cuatrimestres y materias específicas a cada estudiante"
                },
                {
                  icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                  title: "Seguimiento continuo",
                  desc: "Monitorea el progreso académico de los estudiantes registrados"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                    <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h5 className="font-bold text-gray-800 text-xl mb-3">{item.title}</h5>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}