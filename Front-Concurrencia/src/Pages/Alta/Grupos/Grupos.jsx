import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GrupoList from "./GrupoList";
import GrupoForm from "./GrupoForm";
import { gruposService } from "../../../Services/grupos.service";
import { materiasService } from "../../../Services/materias.service";
import { docentesService } from "../../../Services/docentes.service";

export default function Grupos() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");
  const [filtroDocente, setFiltroDocente] = useState("");
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    totalAlumnos: 0,
    materiasDiferentes: 0,
    porcentajePromedioOcupacion: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadMaterias();
    loadDocentes();
    loadGrupos();
  }, []);

  // Aplicar filtros con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      aplicarFiltros();
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, filtroMateria, filtroDocente]);

  const loadMaterias = async () => {
    try {
      const data = await materiasService.getAll();
      setMaterias(data || []);
    } catch (err) {
      console.error("Error al cargar materias:", err);
      setError("Error al cargar las materias");
      setMaterias([]);
    }
  };

  const loadDocentes = async () => {
    try {
      const data = await docentesService.getAll();
      setDocentes(data || []);
    } catch (err) {
      console.error("Error al cargar docentes:", err);
      setError("Error al cargar los docentes");
      setDocentes([]);
    }
  };

  const loadGrupos = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const data = await gruposService.getAll();
      setGrupos(data || []);
      calcularEstadisticas(data || []);
    } catch (err) {
      console.error("Error al cargar grupos:", err);
      setError("Error al cargar los grupos");
      setGrupos([]);
      setEstadisticas({
        total: 0,
        totalAlumnos: 0,
        materiasDiferentes: 0,
        porcentajePromedioOcupacion: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      let data;
      
      // Si hay algún filtro activo, usar filtros combinados
      if (busqueda.trim() !== "" || filtroMateria || filtroDocente) {
        const filters = {};
        if (filtroMateria) filters.materiaId = filtroMateria;
        if (filtroDocente) filters.docenteId = filtroDocente;
        if (busqueda.trim()) filters.search = busqueda.trim();
        
        data = await gruposService.getWithFilters(filters);
      } else {
        // Si no hay filtros, cargar todos
        data = await gruposService.getAll();
      }
      
      setGrupos(data || []);
      calcularEstadisticas(data || []);
    } catch (err) {
      console.error("Error al aplicar filtros:", err);
      setError("Error al aplicar filtros");
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (gruposData) => {
    if (!Array.isArray(gruposData) || gruposData.length === 0) {
      setEstadisticas({
        total: 0,
        totalAlumnos: 0,
        materiasDiferentes: 0,
        porcentajePromedioOcupacion: 0
      });
      return;
    }

    const materiasUnicas = new Set();
    let totalAlumnos = 0;
    let porcentajeTotalOcupacion = 0;

    gruposData.forEach(grupo => {
      // Contar materias diferentes
      if (grupo.materia_id) {
        materiasUnicas.add(grupo.materia_id);
      }

      // Sumar total de alumnos
      totalAlumnos += grupo.total_alumnos || 0;

      // Calcular porcentaje de ocupación
      if (grupo.cupo_maximo && grupo.total_alumnos) {
        const porcentaje = (grupo.total_alumnos / grupo.cupo_maximo) * 100;
        porcentajeTotalOcupacion += porcentaje;
      }
    });

    const porcentajePromedio = gruposData.length > 0 
      ? (porcentajeTotalOcupacion / gruposData.length).toFixed(1)
      : 0;

    setEstadisticas({
      total: gruposData.length,
      totalAlumnos,
      materiasDiferentes: materiasUnicas.size,
      porcentajePromedioOcupacion: porcentajePromedio
    });
  };

  const handleAdd = () => {
    setEditingGrupo(null);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleEdit = (grupo) => {
    setEditingGrupo(grupo);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este grupo?\n\n⚠️ Se eliminarán automáticamente todas las inscripciones relacionadas.")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await gruposService.delete(id);
      if (result.success) {
        setSuccessMessage(result.message || "Grupo eliminado exitosamente");
        loadGrupos(); // Recargar la lista
      } else {
        setError(result.message || "Error al eliminar el grupo");
      }
    } catch (err) {
      console.error("Error al eliminar grupo:", err);
      setError("Error de conexión al eliminar grupo");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (grupoData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      let result;
      
      if (grupoData.id) {
        // Editar grupo existente
        result = await gruposService.update(grupoData.id, grupoData);
      } else {
        // Crear nuevo grupo
        result = await gruposService.create(grupoData);
      }

      if (result.success) {
        setSuccessMessage(result.message || (grupoData.id ? "Grupo actualizado exitosamente" : "Grupo creado exitosamente"));
        setShowForm(false);
        loadGrupos(); // Recargar la lista
      } else {
        setError(result.message || "Error al guardar el grupo");
      }
    } catch (err) {
      console.error("Error al guardar grupo:", err);
      setError("Error de conexión al guardar grupo");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGrupo(null);
    setError(null);
    setSuccessMessage(null);
  };

  const handleAsignarAlumno = async (grupoId, alumnoId) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await gruposService.asignarAlumno(grupoId, alumnoId);
      if (result.success) {
        setSuccessMessage("Alumno asignado exitosamente al grupo");
        // Si estamos viendo ese grupo específico, podríamos actualizar la lista de alumnos
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error al asignar alumno:", err);
      setError("Error al asignar alumno al grupo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-950 p-4 md:p-8">
      
      {/* Botón de regreso */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/alta')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 border border-red-700 hover:border-red-500 shadow-lg hover:shadow-red-500/20"
          disabled={loading}
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
          Gestión de Grupos
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Crea y administra grupos académicos con asignaturas, docentes y alumnos
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          
          {/* SECCIÓN SUPERIOR CON BOTÓN Y ESTADÍSTICAS */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl shadow-md mr-6">
                  <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Administración de Grupos
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-violet-600">{estadisticas.total}</p>
                      <p className="text-gray-600 text-sm">Grupos activos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{estadisticas.materiasDiferentes}</p>
                      <p className="text-gray-600 text-sm">Materias diferentes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">{estadisticas.totalAlumnos}</p>
                      <p className="text-gray-600 text-sm">Alumnos asignados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-600">{estadisticas.porcentajePromedioOcupacion}%</p>
                      <p className="text-gray-600 text-sm">Ocupación promedio</p>
                    </div>
                  </div>
                </div>
              </div>

              {!showForm && (
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 border-2 border-violet-700 hover:border-violet-800 shadow-xl hover:shadow-violet-500/30 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nuevo Grupo
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
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Buscar por nombre de grupo..."
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filtro por materia */}
                <div>
                  <select
                    value={filtroMateria}
                    onChange={(e) => setFiltroMateria(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={loading}
                  >
                    <option value="">Todas las materias</option>
                    {Array.isArray(materias) && materias.map((m) => (
                      <option key={m?.id} value={m?.id}>
                        {m?.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por docente */}
                <div>
                  <select
                    value={filtroDocente}
                    onChange={(e) => setFiltroDocente(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={loading}
                  >
                    <option value="">Todos los docentes</option>
                    {Array.isArray(docentes) && docentes.map((d) => (
                      <option key={d?.id} value={d?.id}>
                        {d?.nombre_completo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Mensajes de estado */}
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

          {successMessage && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-emerald-600">{successMessage}</p>
              </div>
            </div>
          )}

          {/* CONTENIDO DINÁMICO */}
          {loading && !showForm ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-2xl">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              <p className="mt-4 text-gray-600">Cargando grupos...</p>
            </div>
          ) : showForm ? (
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
              <GrupoForm 
                grupo={editingGrupo} 
                materias={materias}
                docentes={docentes}
                onSave={handleSave} 
                onCancel={handleCancel}
                loading={loading}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
              <GrupoList 
                grupos={grupos} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                onAsignarAlumno={handleAsignarAlumno}
                loading={loading}
              />
            </div>
          )}

          {/* SECCIÓN DE INFORMACIÓN */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100 mt-8">
            <div className="text-center mb-12">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Información sobre grupos</h4>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Datos importantes sobre la gestión de grupos académicos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  title: "Composición Grupal",
                  desc: "Cada grupo está compuesto por una asignatura, un docente y varios alumnos"
                },
                {
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                  title: "Asignación Académica",
                  desc: "Los grupos permiten organizar alumnos por materia y docente asignado"
                },
                {
                  icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                  title: "Gestión Integrada",
                  desc: "Facilita el seguimiento y evaluación del rendimiento académico grupal"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-violet-300 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-50 to-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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