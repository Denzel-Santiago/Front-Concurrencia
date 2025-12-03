import { useNavigate } from "react-router-dom";

export default function AltaMenu() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const menuItems = [
    { 
      path: "/alta/programas", 
      label: "Programas de Estudio", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "bg-blue-900",
      borderColor: "border-blue-600",
      hoverBorderColor: "hover:border-blue-400",
      iconBgColor: "bg-blue-800/40",
      hoverIconBgColor: "group-hover:bg-blue-700/40",
      iconColor: "text-blue-300"
    },
    { 
      path: "/alta/cuatrimestres", 
      label: "Cuatrimestres", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "bg-emerald-900",
      borderColor: "border-emerald-600",
      hoverBorderColor: "hover:border-emerald-400",
      iconBgColor: "bg-emerald-800/40",
      hoverIconBgColor: "group-hover:bg-emerald-700/40",
      iconColor: "text-emerald-300"
    },
    { 
      path: "/alta/materias", 
      label: "Materias", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: "bg-purple-900",
      borderColor: "border-purple-600",
      hoverBorderColor: "hover:border-purple-400",
      iconBgColor: "bg-purple-800/40",
      hoverIconBgColor: "group-hover:bg-purple-700/40",
      iconColor: "text-purple-300"
    },
    { 
      path: "/alta/docentes", 
      label: "Docentes", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: "bg-amber-900",
      borderColor: "border-amber-600",
      hoverBorderColor: "hover:border-amber-400",
      iconBgColor: "bg-amber-800/40",
      hoverIconBgColor: "group-hover:bg-amber-700/40",
      iconColor: "text-amber-300"
    },
    { 
      path: "/alta/alumnos", 
      label: "Alumnos", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0h-15" />
        </svg>
      ),
      bgColor: "bg-cyan-900",
      borderColor: "border-cyan-600",
      hoverBorderColor: "hover:border-cyan-400",
      iconBgColor: "bg-cyan-800/40",
      hoverIconBgColor: "group-hover:bg-cyan-700/40",
      iconColor: "text-cyan-300"
    },
    { 
      path: "/alta/grupos", 
      label: "Grupos", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "bg-violet-900",
      borderColor: "border-violet-600",
      hoverBorderColor: "hover:border-violet-400",
      iconBgColor: "bg-violet-800/40",
      hoverIconBgColor: "group-hover:bg-violet-700/40",
      iconColor: "text-violet-300"
    },
  ];

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
          Módulo de Alta
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          Gestión del sistema académico
        </p>
      </div>

      {/* Grid de opciones con colores diferentes */}
      <div className="flex justify-center px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`group ${item.bgColor} rounded-xl p-5 border-2 ${item.borderColor} ${item.hoverBorderColor} transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[200px] w-full max-w-[240px] hover:scale-[1.02] mx-auto`}
            >
              {/* Icono con color personalizado */}
              <div className={`p-3 ${item.iconBgColor} ${item.hoverIconBgColor} rounded-lg mb-4 transition-colors`}>
                <div className={`${item.iconColor} group-hover:opacity-90 transition-colors`}>
                  {item.icon}
                </div>
              </div>
              
              {/* Título */}
              <h2 className="text-lg font-bold text-white mb-2 text-center group-hover:text-opacity-90 transition-colors leading-tight px-2">
                {item.label}
              </h2>
              
              {/* Indicador de click */}
              <div className="mt-2 text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span>Acceder</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

       

    </div>
  );
}