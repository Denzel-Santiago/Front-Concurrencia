import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-blue-950 flex flex-col items-center justify-center p-6">
      
      {/* Header con título elegante */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          Plataforma Universitaria de Estudiantes
        </h1>
        <p className="text-gray-300 text-lg">
          Sistema de Gestión Académica
        </p>
      </div>

      {/* Cards cuadradas y grandes */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card Módulo de Alta - Cuadrada */}
          <div className="group">
            <div className="bg-blue-900 rounded-2xl p-8 border-2 border-blue-700 hover:border-blue-500 transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[400px]">
              {/* Icono grande centrado */}
              <div className="p-5 bg-blue-800 rounded-xl mb-8">
                <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              {/* Título */}
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                Módulo de Alta
              </h2>
              
              {/* Botón grande */}
              <button
                onClick={() => handleNavigation('/alta')}
                className="w-full max-w-xs bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group mt-8"
              >
                <span className="text-lg">Acceder</span>
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card Conexión con Plataforma - Cuadrada */}
          <div className="group">
            <div className="bg-green-900 rounded-2xl p-8 border-2 border-green-700 hover:border-emerald-500 transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[400px]">
              {/* Icono grande centrado */}
              <div className="p-5 bg-emerald-900/30 rounded-xl mb-8">
                <svg className="w-16 h-16 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Título */}
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                Conexión con Plataforma
              </h2>
              
              {/* Botón grande */}
              <button
                onClick={() => handleNavigation('/plataforma')}
                className="w-full max-w-xs bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group mt-8"
              >
                <span className="text-lg">Conectar</span>
                <svg className="w-6 h-6 ml-3 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} Plataforma Universitaria de Estudiantes
        </p>
      </footer>
    </div>
  );
}