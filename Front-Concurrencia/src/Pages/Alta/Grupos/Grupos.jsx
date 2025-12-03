import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GrupoList from "./GrupoList";
import GrupoForm from "./GrupoForm";

export default function Grupos() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    setEditingGrupo(null);
    setShowForm(true);
  };

  const handleEdit = (grupo) => {
    setEditingGrupo(grupo);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setGrupos(grupos.filter((g) => g.id !== id));
  };

  const handleSave = (grupo) => {
    if (grupo.id) {
      setGrupos(grupos.map((g) => (g.id === grupo.id ? grupo : g)));
    } else {
      grupo.id = Date.now();
      setGrupos([...grupos, grupo]);
    }
    setShowForm(false);
  };

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
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
                      <p className="text-2xl font-bold text-violet-600">{grupos.length}</p>
                      <p className="text-gray-600 text-sm">Grupos activos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {[...new Set(grupos.map(g => g.asignatura))].length}
                      </p>
                      <p className="text-gray-600 text-sm">Materias diferentes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">
                        {grupos.reduce((total, grupo) => total + grupo.alumnos.length, 0)}
                      </p>
                      <p className="text-gray-600 text-sm">Alumnos asignados</p>
                    </div>
                  </div>
                </div>
              </div>

              {!showForm && (
                <button
                  onClick={handleAdd}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 border-2 border-violet-700 hover:border-violet-800 shadow-xl hover:shadow-violet-500/30 transform hover:-translate-y-1"
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
          </div>

          {/* CONTENIDO DINÁMICO */}
          {showForm ? (
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
              <GrupoForm 
                grupo={editingGrupo} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
              <GrupoList 
                grupos={grupos} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
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