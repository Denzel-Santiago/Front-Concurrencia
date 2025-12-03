import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DocenteForm from "./DocenteForm";
import DocenteList from "./DocenteList";

export default function Docentes() {
  const navigate = useNavigate();
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [cuatrimestreSeleccionado, setCuatrimestreSeleccionado] = useState("");
  const [docentes, setDocentes] = useState([]);

  const programas = [
    { id: 1, nombre: "Ingeniería en Software", cuatrimestres: 10 },
    { id: 2, nombre: "Administración de Empresas", cuatrimestres: 8 },
    { id: 3, nombre: "Diseño Digital", cuatrimestres: 9 }
  ];

  const cuatrimestres = [
    { id: 1, numero: 1, nombre: "1er Cuatrimestre", programaId: 1 },
    { id: 2, numero: 3, nombre: "3er Cuatrimestre", programaId: 1 },
    { id: 3, numero: 5, nombre: "5to Cuatrimestre", programaId: 1 },
    { id: 4, numero: 1, nombre: "1er Cuatrimestre", programaId: 2 },
    { id: 5, numero: 3, nombre: "3er Cuatrimestre", programaId: 2 },
    { id: 6, numero: 1, nombre: "1er Cuatrimestre", programaId: 3 },
  ];

  const materias = [
    { id: 1, cuatrimestreId: 1, nombre: "Programación I", clave: "ISC-101" },
    { id: 2, cuatrimestreId: 1, nombre: "Matemáticas I", clave: "MAT-101" },
    { id: 3, cuatrimestreId: 2, nombre: "Estructuras de Datos", clave: "ISC-201" },
    { id: 4, cuatrimestreId: 3, nombre: "Bases de Datos", clave: "ISC-301" },
    { id: 5, cuatrimestreId: 4, nombre: "Contabilidad I", clave: "ADM-101" },
    { id: 6, cuatrimestreId: 5, nombre: "Finanzas Corporativas", clave: "ADM-201" },
    { id: 7, cuatrimestreId: 6, nombre: "Diseño Gráfico", clave: "DIG-101" },
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
          Gestión de Docentes
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Asigna docentes a las materias de los programas académicos
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
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full mb-6 border-4 border-white shadow-lg">
                  <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Paso 1: Seleccionar Programa y Cuatrimestre
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Elige el programa y cuatrimestre para asignar docentes a las materias
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
                      Selecciona el cuatrimestre (solo impares)
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
                            {c.nombre}
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
                          <p className="text-emerald-700 text-sm mt-1">
                            {materias.filter(m => m.cuatrimestreId.toString() === cuatrimestreSeleccionado).length} materias disponibles
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {!programaSeleccionado ? "Selecciona un programa" : "Selecciona un cuatrimestre"}
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                    {!programaSeleccionado 
                      ? "Primero elige un programa de estudio para continuar con la gestión de docentes."
                      : "Ahora selecciona un cuatrimestre del programa para asignar docentes a las materias."
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
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-2xl p-8 mb-12 border-2 border-amber-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center">
                    <div className="p-4 bg-white rounded-xl shadow-md mr-6">
                      <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Docentes
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

              {/* Información de materias disponibles */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Materias disponibles en este cuatrimestre
                    </h3>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {materias.filter(m => m.cuatrimestreId.toString() === cuatrimestreSeleccionado).length} materias
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materias
                    .filter(m => m.cuatrimestreId.toString() === cuatrimestreSeleccionado)
                    .map(materia => (
                      <div key={materia.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800">{materia.nombre}</p>
                        <p className="text-gray-600 text-sm">Clave: {materia.clave}</p>
                      </div>
                    ))}
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
                      Completa los datos para asignar un docente a las materias
                    </p>
                  </div>
                  <div className="mt-8">
                    <DocenteForm
                      cuatrimestreId={cuatrimestreSeleccionado}
                      materias={materias.filter(m => m.cuatrimestreId.toString() === cuatrimestreSeleccionado)}
                      setDocentes={setDocentes}
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
                      <span className="bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 text-lg font-bold px-5 py-2 rounded-full shadow-sm">
                        {docentes.length} registrados
                      </span>
                    </div>
                    <p className="text-gray-600 text-lg">
                      Lista de docentes asignados a este cuatrimestre
                    </p>
                  </div>
                  <div className="mt-8">
                    <DocenteList docentes={docentes} />
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
            </>
          )}

        </div>
      </div>

    </div>
  );
}