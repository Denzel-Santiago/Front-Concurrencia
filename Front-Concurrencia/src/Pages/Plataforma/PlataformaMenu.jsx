import { useNavigate } from "react-router-dom";

export default function PlataformaMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-blue-950 p-4">
      
      {/* Botón de regreso rojo en esquina superior izquierda */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 border border-red-700 hover:border-red-500 shadow-md hover:shadow-red-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Volver</span>
        </button>
      </div>

      {/* Header centrado */}
      <div className="text-center mb-10 pt-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Conexión con Plataforma
        </h1>
        <p className="text-gray-300 text-lg">
          Sincronización con Moodle
        </p>
      </div>

      {/* Contenido principal */}
      <div className="flex justify-center px-2">
        <div className="bg-blue-900 rounded-2xl p-8 border-2 border-blue-700 max-w-2xl w-full">
          
          {/* Icono central */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-900/30 rounded-xl">
              <svg className="w-12 h-12 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-lg text-blue-200 mb-8 text-center">
            Selecciona un programa de estudio para comenzar a gestionar los cursos 
            y matriculaciones en la plataforma Moodle.
          </p>

          {/* Características */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
              <span className="text-blue-300">Verificación y creación de cursos</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
              <span className="text-blue-300">Gestión de usuarios profesores</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
              <span className="text-blue-300">Matriculación masiva de alumnos</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
              <span className="text-blue-300">Ejecución paralela de procesos</span>
            </div>
          </div>

          {/* Botón principal */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/plataforma/seleccionar-programa')}
              className="group bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 border border-emerald-600 hover:border-emerald-500"
            >
              <span className="text-lg">Iniciar Proceso de Sincronización</span>
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

        </div>
      </div>

     

    </div>
  );
}