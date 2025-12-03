import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MateriaForm from "./MateriaForm";
import MateriaList from "./MateriaList";

export default function Materias() {
  const navigate = useNavigate();
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [cuatrimestreSeleccionado, setCuatrimestreSeleccionado] = useState("");
  const [materias, setMaterias] = useState([]);

  const programas = [
    { id: 1, nombre: "Ingeniería en Software", cuatrimestres: 10 },
    { id: 2, nombre: "Administración de Empresas", cuatrimestres: 8 },
    { id: 3, nombre: "Diseño Digital", cuatrimestres: 9 }
  ];

  const cuatrimestres = [
    { id: 1, numero: 1, nombre: "Primer Cuatrimestre", programaId: 1 },
    { id: 2, numero: 2, nombre: "Segundo Cuatrimestre", programaId: 1 },
    { id: 3, numero: 1, nombre: "Primer Cuatrimestre", programaId: 2 },
    { id: 4, numero: 2, nombre: "Segundo Cuatrimestre", programaId: 2 },
    { id: 5, numero: 3, nombre: "Tercer Cuatrimestre", programaId: 1 },
    { id: 6, numero: 1, nombre: "Primer Cuatrimestre", programaId: 3 },
  ];

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
          Gestión de Materias
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Asigna materias a los cuatrimestres de los programas académicos
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          
          {/* SECCIÓN 1: SELECTORES */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-2xl p-10">
              
              {/* Título de sección */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full mb-6 border-4 border-white shadow-lg">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Paso 1: Seleccionar Programa y Cuatrimestre
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Elige el programa y cuatrimestre al que deseas asignar materias
                </p>
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
                      Selecciona el programa académico
                    </p>
                    <select
                      className="w-full bg-white border-2 border-gray-300 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                      value={programaSeleccionado}
                      onChange={(e) => {
                        setProgramaSeleccionado(e.target.value);
                        setCuatrimestreSeleccionado("");
                      }}
                    >
                      <option value="" className="text-gray-400">-- Selecciona un programa --</option>
                      {programas.map((p) => (
                        <option key={p.id} value={p.id} className="text-gray-800">
                          {p.nombre} ({p.cuatrimestres} cuatrimestres)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Información del programa seleccionado */}
                  {programaSeleccionado && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-blue-800 font-semibold text-lg">
                            Programa seleccionado:
                          </p>
                          <p className="text-blue-900 text-xl font-bold">
                            {programas.find(p => p.id.toString() === programaSeleccionado)?.nombre}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selector de Cuatrimestre */}
                <div className="space-y-6">
                  <div className={`bg-blue-50 p-6 rounded-xl border ${programaSeleccionado ? 'border-blue-100' : 'border-gray-200 opacity-50'}`}>
                    <label className="block text-gray-800 font-bold text-xl mb-3">
                      Cuatrimestre
                    </label>
                    <p className="text-gray-600 text-base mb-4">
                      Selecciona el cuatrimestre del programa
                    </p>
                    <select
                      className={`w-full bg-white border-2 ${programaSeleccionado ? 'border-gray-300 cursor-pointer' : 'border-gray-200 cursor-not-allowed'} rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 appearance-none shadow-sm`}
                      value={cuatrimestreSeleccionado}
                      onChange={(e) => setCuatrimestreSeleccionado(e.target.value)}
                      disabled={!programaSeleccionado}
                    >
                      <option value="" className="text-gray-400">-- Selecciona un cuatrimestre --</option>
                      {cuatrimestres
                        .filter((c) => c.programaId == programaSeleccionado)
                        .map((c) => (
                          <option key={c.id} value={c.id} className="text-gray-800">
                            {c.nombre} (#{c.numero})
                          </option>
                        ))}
                    </select>
                    {!programaSeleccionado && (
                      <p className="text-gray-500 text-sm mt-3">
                        Primero selecciona un programa
                      </p>
                    )}
                  </div>

                  {/* Información del cuatrimestre seleccionado */}
                  {cuatrimestreSeleccionado && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border-2 border-emerald-200">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-emerald-800 font-semibold text-lg">
                            Cuatrimestre seleccionado:
                          </p>
                          <p className="text-emerald-900 text-xl font-bold">
                            {cuatrimestres.find(c => c.id.toString() === cuatrimestreSeleccionado)?.nombre}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MENSAJE CUANDO NO HAY SELECCIÓN COMPLETA */}
          {(!programaSeleccionado || !cuatrimestreSeleccionado) && (
            <div className="flex justify-center mb-16">
              <div className="w-full max-w-2xl">
                <div className="text-center bg-white rounded-2xl shadow-2xl p-10 md:p-12">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {!programaSeleccionado ? "Selecciona un programa" : "Selecciona un cuatrimestre"}
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                    {!programaSeleccionado 
                      ? "Primero elige un programa de estudio para continuar con la gestión de materias."
                      : "Ahora selecciona un cuatrimestre del programa para comenzar a asignar materias."
                    }
                  </p>
                  <div className="inline-flex items-center justify-center text-gray-500 bg-gray-100 px-6 py-3 rounded-xl">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="font-medium">
                      {!programaSeleccionado ? "Selecciona un programa de arriba" : "Elige un cuatrimestre de la lista"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO PRINCIPAL CUANDO TODO ESTÁ SELECCIONADO */}
          {programaSeleccionado && cuatrimestreSeleccionado && (
            <>
              {/* Header de selección */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-2xl p-8 mb-12 border-2 border-purple-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center">
                    <div className="p-4 bg-white rounded-xl shadow-md mr-6">
                      <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Materias
                      </h2>
                      <div className="text-gray-700 text-lg">
                        <p className="mb-1">
                          <span className="font-semibold">Programa:</span>{" "}
                          <span className="text-blue-800 font-bold">
                            {programas.find(p => p.id.toString() === programaSeleccionado)?.nombre}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold">Cuatrimestre:</span>{" "}
                          <span className="text-emerald-800 font-bold">
                            {cuatrimestres.find(c => c.id.toString() === cuatrimestreSeleccionado)?.nombre}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCuatrimestreSeleccionado("")}
                      className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 font-semibold shadow-md hover:shadow-lg"
                    >
                      Cambiar Cuatrimestre
                    </button>
                    <button
                      onClick={() => {
                        setProgramaSeleccionado("");
                        setCuatrimestreSeleccionado("");
                      }}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 font-semibold shadow-md hover:shadow-lg"
                    >
                      Cambiar Programa
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid de formulario y listado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                
                {/* CARD 1: FORMULARIO */}
                <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full mb-6 shadow-inner">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Registrar Nueva Materia
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Completa los datos para agregar una materia al cuatrimestre
                    </p>
                  </div>
                  <div className="mt-8">
                    <MateriaForm
                      cuatrimestreId={cuatrimestreSeleccionado}
                      setMaterias={setMaterias}
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
                        Materias Registradas
                      </h3>
                      <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-lg font-bold px-5 py-2 rounded-full shadow-sm">
                        {materias.length} registradas
                      </span>
                    </div>
                    <p className="text-gray-600 text-lg">
                      Lista de materias asignadas a este cuatrimestre
                    </p>
                  </div>
                  <div className="mt-8">
                    <MateriaList materias={materias} />
                  </div>
                </div>
              </div>

              {/* SECCIÓN DE INFORMACIÓN */}
              <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100 mb-8">
                <div className="text-center mb-12">
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">Información sobre materias</h4>
                  <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                    Datos importantes sobre la gestión de materias académicas
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {[
                    {
                      icon: "M12 14l9-5-9-5-9 5 9 5z",
                      title: "Plan de Estudios",
                      desc: "Cada materia forma parte del plan de estudios del programa"
                    },
                    {
                      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                      title: "Horas Académicas",
                      desc: "Define las horas teóricas y prácticas de cada materia"
                    },
                    {
                      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                      title: "Docentes",
                      desc: "Puedes asignar uno o varios docentes a cada materia"
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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