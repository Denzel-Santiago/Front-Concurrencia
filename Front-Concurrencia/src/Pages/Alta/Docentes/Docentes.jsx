import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocenteForm from "./DocenteForm";
import DocenteList from "./DocenteList";
import { docentesService } from "../../../Services/docentes.service";
import { programasService } from "../../../Services/programasService";
import { cuatrimestresService } from "../../../Services/cuatrimestresService";
import { materiasService } from "../../../Services/materias.service";

export default function Docentes() {
  const navigate = useNavigate();
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [cuatrimestreSeleccionado, setCuatrimestreSeleccionado] = useState("");
  const [docentes, setDocentes] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [cuatrimestres, setCuatrimestres] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState({
    programas: false,
    cuatrimestres: false,
    materias: false,
    docentes: false
  });
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar programas desde la API
  useEffect(() => {
    const loadProgramas = async () => {
      setLoading(prev => ({ ...prev, programas: true }));
      try {
        const data = await programasService.getAll();
        setProgramas(data || []);
      } catch (err) {
        console.error("Error al cargar programas:", err);
        setError("Error al cargar los programas");
        setProgramas([]);
      } finally {
        setLoading(prev => ({ ...prev, programas: false }));
      }
    };

    loadProgramas();
  }, []);

  // Cargar cuatrimestres cuando se selecciona un programa
  useEffect(() => {
    if (programaSeleccionado) {
      loadCuatrimestresByPrograma(programaSeleccionado);
      setCuatrimestreSeleccionado(""); // Resetear cuatrimestre seleccionado
    } else {
      setCuatrimestres([]);
      setCuatrimestreSeleccionado("");
      setMaterias([]);
    }
  }, [programaSeleccionado]);

  // Cargar materias cuando se selecciona un cuatrimestre
  useEffect(() => {
    if (cuatrimestreSeleccionado) {
      loadMateriasByCuatrimestre(cuatrimestreSeleccionado);
      loadDocentes();
    } else {
      setMaterias([]);
      setDocentes([]);
    }
  }, [cuatrimestreSeleccionado]);

  // Cargar docentes cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda.trim() !== "") {
      buscarDocentes(busqueda);
    } else {
      loadDocentes();
    }
  }, [busqueda]);

  const loadCuatrimestresByPrograma = async (programaId) => {
    setLoading(prev => ({ ...prev, cuatrimestres: true }));
    setError(null);
    try {
      const data = await cuatrimestresService.getByPrograma(programaId);
      setCuatrimestres(data || []);
    } catch (err) {
      console.error("Error al cargar cuatrimestres:", err);
      setError("Error al cargar cuatrimestres del programa");
      setCuatrimestres([]);
    } finally {
      setLoading(prev => ({ ...prev, cuatrimestres: false }));
    }
  };

  const loadMateriasByCuatrimestre = async (cuatrimestreId) => {
    setLoading(prev => ({ ...prev, materias: true }));
    setError(null);
    try {
      const data = await materiasService.getByCuatrimestre(cuatrimestreId);
      setMaterias(data || []);
    } catch (err) {
      console.error("Error al cargar materias:", err);
      setError("Error al cargar materias del cuatrimestre");
      setMaterias([]);
    } finally {
      setLoading(prev => ({ ...prev, materias: false }));
    }
  };

  const loadDocentes = async () => {
    setLoading(prev => ({ ...prev, docentes: true }));
    setError(null);
    try {
      const data = await docentesService.getAll();
      setDocentes(data || []);
    } catch (err) {
      console.error("Error al cargar docentes:", err);
      setError("Error al cargar docentes");
      setDocentes([]);
    } finally {
      setLoading(prev => ({ ...prev, docentes: false }));
    }
  };

  const buscarDocentes = async (query) => {
    setLoading(prev => ({ ...prev, docentes: true }));
    setError(null);
    try {
      const data = await docentesService.search(query);
      setDocentes(data || []);
    } catch (err) {
      console.error("Error al buscar docentes:", err);
      setError("Error al buscar docentes");
      setDocentes([]);
    } finally {
      setLoading(prev => ({ ...prev, docentes: false }));
    }
  };

  const handleDocenteCreated = () => {
    loadDocentes();
  };

  const handleDocenteDeleted = () => {
    loadDocentes();
  };

  const handleDocenteUpdated = () => {
    loadDocentes();
  };

  const programaSeleccionadoObj = programas.find(p => 
    p && p.id && p.id.toString() === programaSeleccionado
  );

  const cuatrimestreSeleccionadoObj = cuatrimestres.find(c => 
    c && c.id && c.id.toString() === cuatrimestreSeleccionado
  );

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
      <div className="text-center mb-14 pt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Gestión de Docentes
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Administra los docentes y asígnalos a las materias de los programas académicos
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          
          {/* SECCIÓN 1: SELECTORES Y BÚSQUEDA */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-2xl p-10">
              
              {/* Título de sección */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full mb-6 border-4 border-white shadow-lg">
                  <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Gestión de Docentes
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Administra los docentes y búsqueda global
                </p>
              </div>

              {/* Barra de búsqueda */}
              <div className="mb-10">
                <div className="relative">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 pl-12 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:border-amber-500 hover:border-gray-400 transition-all duration-300 shadow-sm"
                    placeholder="Buscar docente por nombre o email..."
                    disabled={loading.docentes}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de selectores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Selector de Programa */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <label className="block text-gray-800 font-bold text-xl mb-3">
                      Programa de Estudio
                    </label>
                    <p className="text-gray-600 text-base mb-4">
                      Filtra docentes por programa (opcional)
                    </p>
                    <select
                      className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                      value={programaSeleccionado}
                      onChange={(e) => {
                        setProgramaSeleccionado(e.target.value);
                        setCuatrimestreSeleccionado("");
                      }}
                      disabled={loading.programas}
                    >
                      <option value="" className="text-gray-400">-- Todos los programas --</option>
                      {loading.programas ? (
                        <option disabled className="text-gray-400">Cargando programas...</option>
                      ) : (
                        Array.isArray(programas) && programas.map((p) => (
                          <option key={p?.id || Math.random()} value={p?.id || ""} className="text-gray-800">
                            {p?.nombre}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Selector de Cuatrimestre */}
                <div className="space-y-6">
                  <div className={`bg-blue-50 p-6 rounded-xl border ${programaSeleccionado ? 'border-blue-100' : 'border-gray-200 opacity-50'}`}>
                    <label className="block text-gray-800 font-bold text-xl mb-3">
                      Cuatrimestre
                    </label>
                    <p className="text-gray-600 text-base mb-4">
                      Filtra docentes por cuatrimestre (opcional)
                    </p>
                    <select
                      className={`w-full bg-white border-2 ${programaSeleccionado ? 'border-gray-300 cursor-pointer' : 'border-gray-200 cursor-not-allowed'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 appearance-none shadow-sm`}
                      value={cuatrimestreSeleccionado}
                      onChange={(e) => setCuatrimestreSeleccionado(e.target.value)}
                      disabled={!programaSeleccionado || loading.cuatrimestres}
                    >
                      <option value="" className="text-gray-400">-- Todos los cuatrimestres --</option>
                      {loading.cuatrimestres ? (
                        <option disabled className="text-gray-400">Cargando cuatrimestres...</option>
                      ) : (
                        Array.isArray(cuatrimestres) && cuatrimestres.map((c) => (
                          <option key={c?.id || Math.random()} value={c?.id || ""} className="text-gray-800">
                            {c?.nombre} (#{c?.numero})
                          </option>
                        ))
                      )}
                    </select>
                    {!programaSeleccionado && (
                      <p className="text-gray-500 text-sm mt-3">
                        Selecciona un programa para ver cuatrimestres
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mensajes de estado */}
              {loading.docentes && (
                <div className="mt-6 text-center">
                  <p className="text-amber-600">Buscando docentes...</p>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Grid de formulario y listado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* CARD 1: FORMULARIO */}
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full mb-6 shadow-inner">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Registrar Nuevo Docente
                </h3>
                <p className="text-gray-600 text-lg">
                  Completa los datos para agregar un nuevo docente
                </p>
              </div>
              <div className="mt-8">
                <DocenteForm
                  onDocenteCreated={handleDocenteCreated}
                />
              </div>
            </div>

            {/* CARD 2: LISTADO */}
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-50 to-green-100 rounded-full mb-6 shadow-inner">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="inline-flex items-center gap-4 mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Docentes Registrados
                  </h3>
                  {!loading.docentes && Array.isArray(docentes) && (
                    <span className="bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 text-lg font-bold px-5 py-2 rounded-full shadow-sm">
                      {docentes.length} registrados
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-lg">
                  {busqueda ? `Resultados para: "${busqueda}"` : "Todos los docentes registrados"}
                </p>
              </div>
              <div className="mt-8">
                {loading.docentes ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    <p className="mt-4 text-gray-600">Cargando docentes...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-600">{error}</p>
                    <button
                      onClick={loadDocentes}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : Array.isArray(docentes) ? (
                  <DocenteList 
                    docentes={docentes} 
                    onDocenteDeleted={handleDocenteDeleted}
                    onDocenteUpdated={handleDocenteUpdated}
                  />
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-600">No hay datos disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN DE INFORMACIÓN */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100 mb-8">
            <div className="text-center mb-12">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Información sobre docentes</h4>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Datos importantes sobre la gestión de docentes académicos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  title: "Perfil Docente",
                  desc: "Registra la información personal y profesional del docente"
                },
                {
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                  title: "Asignación de Materias",
                  desc: "Un docente puede impartir una o varias materias"
                },
                {
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  title: "Contacto",
                  desc: "Incluye información de contacto para comunicación académica"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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