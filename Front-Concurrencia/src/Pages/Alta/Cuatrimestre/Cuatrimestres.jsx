import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CuatrimestreForm from "./CuatrimestreForm";
import CuatrimestreList from "./CuatrimestreList";
import { cuatrimestresService } from "../../../Services/cuatrimestresService";
import { programasService } from "../../../Services/programasService";

export default function Cuatrimestres() {
  const navigate = useNavigate();
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [cuatrimestres, setCuatrimestres] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar programas desde la API
  useEffect(() => {
    const loadProgramas = async () => {
      setLoading(true);
      try {
        const data = await programasService.getAll();
        setProgramas(data);
      } catch (err) {
        setError("Error al cargar los programas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProgramas();
  }, []);

  // Cargar cuatrimestres cuando se selecciona un programa
  useEffect(() => {
    if (programaSeleccionado) {
      loadCuatrimestresByPrograma(programaSeleccionado);
    } else {
      setCuatrimestres([]);
    }
  }, [programaSeleccionado]);

  const loadCuatrimestresByPrograma = async (programaId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cuatrimestresService.getByPrograma(programaId);
      setCuatrimestres(data);
    } catch (err) {
      setError("Error al cargar cuatrimestres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCuatrimestreCreated = () => {
    if (programaSeleccionado) {
      loadCuatrimestresByPrograma(programaSeleccionado);
    }
  };

  const handleCuatrimestreDeleted = () => {
    if (programaSeleccionado) {
      loadCuatrimestresByPrograma(programaSeleccionado);
    }
  };

  const handleCuatrimestreUpdated = () => {
    if (programaSeleccionado) {
      loadCuatrimestresByPrograma(programaSeleccionado);
    }
  };

  const programaSeleccionadoObj = programas.find(p => p.id.toString() === programaSeleccionado);

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
          Gestión de Cuatrimestres
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Administra los cuatrimestres de los programas académicos
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex justify-center">
        <div className="w-full max-w-7xl">
          
          {/* SECCIÓN 1: SELECTOR DE PROGRAMA */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-2xl p-10">
              
              {/* Título de sección */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full mb-6 border-4 border-white shadow-lg">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Paso 1: Seleccionar Programa
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Elige un programa académico para gestionar sus cuatrimestres
                </p>
              </div>

              {/* Selector */}
              <div className="space-y-8">
                <div className="text-center">
                  <label className="block text-gray-800 font-bold text-xl mb-4">
                    Programa de Estudio
                  </label>
                  <p className="text-gray-600 text-base mb-8 max-w-xl mx-auto">
                    Selecciona el programa al que deseas asignar cuatrimestres
                  </p>
                </div>

                <div className="flex justify-center">
                  <select
                    className="w-full max-w-2xl bg-white border-2 border-gray-300 rounded-xl px-6 py-5 text-gray-800 text-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer text-center shadow-sm"
                    value={programaSeleccionado}
                    onChange={(e) => setProgramaSeleccionado(e.target.value)}
                    disabled={loading && programas.length === 0}
                  >
                    <option value="" className="text-gray-400 text-lg">-- Selecciona un programa --</option>
                    {loading && programas.length === 0 ? (
                      <option disabled className="text-gray-400">
                        Cargando programas...
                      </option>
                    ) : (
                      programas.map((p) => (
                        <option key={p.id} value={p.id} className="text-gray-800 text-lg">
                          {p.nombre}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Mensajes de error */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Mensaje de programa seleccionado */}
              {programaSeleccionado && programaSeleccionadoObj && (
                <div className="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-emerald-900 text-2xl font-bold">
                      Programa seleccionado
                    </p>
                  </div>
                  <p className="text-emerald-800 text-xl mb-2">
                    <span className="font-semibold">
                      {programaSeleccionadoObj.nombre}
                    </span>
                  </p>
                  <p className="text-emerald-700">
                    Ahora puedes gestionar los cuatrimestres de este programa
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 2: CONTENIDO PRINCIPAL (SOLO SI HAY PROGRAMA SELECCIONADO) */}
          {programaSeleccionado && programaSeleccionadoObj && (
            <>
              {/* Header de programa */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-2xl p-8 mb-12 border-2 border-blue-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center">
                    <div className="p-4 bg-white rounded-xl shadow-md mr-6">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Cuatrimestres
                      </h2>
                      <p className="text-gray-700 text-lg">
                        Programa: <span className="font-semibold text-blue-800">
                          {programaSeleccionadoObj.nombre}
                        </span>
                      </p>
                      {loading && (
                        <p className="text-blue-600 text-sm mt-1">
                          Cargando cuatrimestres...
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProgramaSeleccionado("");
                      setCuatrimestres([]);
                      setError(null);
                    }}
                    className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 font-semibold shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    Cambiar Programa
                  </button>
                </div>
              </div>

              {/* GRID DE FORMULARIO Y LISTADO */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                
                {/* CARD 1: FORMULARIO */}
                <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mb-6 shadow-inner">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Registrar Nuevo Cuatrimestre
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Completa los datos para agregar un cuatrimestre al programa
                    </p>
                  </div>
                  <div className="mt-8">
                    <CuatrimestreForm
                      programaId={programaSeleccionado}
                      onCuatrimestreCreated={handleCuatrimestreCreated}
                    />
                  </div>
                </div>

                {/* CARD 2: LISTADO */}
                <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-50 to-green-100 rounded-full mb-6 shadow-inner">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="inline-flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Cuatrimestres Registrados
                      </h3>
                      {!loading && (
                        <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-lg font-bold px-5 py-2 rounded-full shadow-sm">
                          {cuatrimestres.length} registrados
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-lg">
                      Lista de cuatrimestres asignados a este programa
                    </p>
                  </div>
                  <div className="mt-8">
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Cargando cuatrimestres...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-red-600">{error}</p>
                        <button
                          onClick={() => loadCuatrimestresByPrograma(programaSeleccionado)}
                          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Reintentar
                        </button>
                      </div>
                    ) : (
                      <CuatrimestreList 
                        cuatrimestres={cuatrimestres} 
                        onCuatrimestreDeleted={handleCuatrimestreDeleted}
                        onCuatrimestreUpdated={handleCuatrimestreUpdated}
                        programaId={programaSeleccionado}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: INFORMACIÓN ADICIONAL */}
              <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100 mb-8">
                <div className="text-center mb-12">
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">Información sobre cuatrimestres</h4>
                  <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                    Datos importantes sobre la gestión de cuatrimestres académicos
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {[
                    {
                      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                      title: "Duración",
                      desc: "Cada cuatrimestre representa un período académico de 4 meses"
                    },
                    {
                      icon: "M13 10V3L4 14h7v7l9-11h-7z",
                      title: "Secuencia",
                      desc: "Los cuatrimestres se asignan secuencialmente (1, 2, 3, etc.)"
                    },
                    {
                      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                      title: "Personalización",
                      desc: "Puedes agregar descripciones específicas para cada cuatrimestre"
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <h5 className="font-bold text-gray-800 text-xl mb-3">{item.title}</h5>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}