import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlumnoList from "./AlumnoList";
import AlumnoForm from "./AlumnoForm";

export default function Alumnos() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    setEditingAlumno(null);
    setShowForm(true);
  };

  const handleEdit = (alumno) => {
    setEditingAlumno(alumno);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAlumnos(alumnos.filter((a) => a.id !== id));
  };

  const handleSave = (alumno) => {
    if (alumno.id) {
      // editar
      setAlumnos(alumnos.map((a) => (a.id === alumno.id ? alumno : a)));
    } else {
      // crear
      alumno.id = Date.now();
      setAlumnos([...alumnos, alumno]);
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
          Gestión de Alumnos
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Administra el registro y seguimiento de estudiantes académicos
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          
          {/* SECCIÓN SUPERIOR CON BOTÓN Y ESTADÍSTICAS */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
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
                      <p className="text-2xl font-bold text-cyan-600">{alumnos.length}</p>
                      <p className="text-gray-600 text-sm">Alumnos registrados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {[...new Set(alumnos.map(a => a.cuatrimestre))].length}
                      </p>
                      <p className="text-gray-600 text-sm">Cuatrimestres activos</p>
                    </div>
                  </div>
                </div>
              </div>

              {!showForm && (
                <button
                  onClick={handleAdd}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 border-2 border-cyan-700 hover:border-cyan-800 shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-1"
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
          </div>

          {/* CONTENIDO DINÁMICO */}
          {showForm ? (
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100">
              <AlumnoForm 
                alumno={editingAlumno} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
              <AlumnoList 
                alumnos={alumnos} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
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