// src/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas principales
import Home from "../pages/Home";
import AltaMenu from "../pages/Alta/AltaMenu";
import PlataformaMenu from "../pages/Plataforma/PlataformaMenu";

// Módulo Alta - Programas
import ProgramasList from "../pages/Alta/Programas/ProgramasList";
import ProgramasForm from "../pages/Alta/Programas/ProgramasForm";

// Módulo Alta - Cuatrimestres
import Cuatrimestres from "../pages/Alta/Cuatrimestres/Cuatrimestres";
import CuatrimestreForm from "../pages/Alta/Cuatrimestres/CuatrimestreForm";
import CuatrimestreList from "../pages/Alta/Cuatrimestres/CuatrimestreList";

// Módulo Alta - Materias
import Materias from "../pages/Alta/Materias/Materias";
import MateriaForm from "../../pages/Alta/Materias/MateriaForm";
import MateriaList from "../,,/pages/Alta/Materias/MateriaList";

// Módulo Alta - Docentes
import Docentes from "../../pages/Alta/Docentes/Docentes";
import DocenteList from "../../pages/Alta/Docentes/DocenteList";
import DocenteForm from "../../pages/Alta/Docentes/DocenteForm";

// Módulo Alta - Alumnos
import Alumnos from "../pages/Alta/Alumnos/Alumnos";
import AlumnoList from "../../pages/Alta/Alumnos/AlumnoList";
import AlumnoForm from "../../pages/Alta/Alumnos/AlumnoForm";

// Módulo Alta - Grupos
import Grupos from "../pages/Alta/Grupos/Grupos";
import GrupoList from "../../pages/Alta/Grupos/GrupoList";
import GrupoForm from "../../pages/Alta/Grupos/GrupoForm";

// Módulo Plataforma - Componentes principales
import Plataforma from "../../pages/Plataforma/Plataforma";

// Módulo Plataforma - Componentes individuales (si los quieres separados)
import EstadoProcesos from "../components/Plataforma/EstadoProcesos";
import Resultados from "../components/Plataforma/Resultados";
import InfoCurso from "../components/Plataforma/InfoCurso";
import SelectorJerarquico from "../components/Plataforma/SelectorJerarquico";
import PanelAcciones from "../components/Plataforma/PanelAcciones";

// Módulo Plataforma - Modales
import ModalCrearUsuarioMoodle from "../components/Plataforma/modales/ModalCrearUsuarioMoodle";
import ModalCrearCursoMoodle from "../components/Plataforma/modales/ModalCrearCursoMoodle";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />

        {/* Módulo de Alta */}
        <Route path="/alta" element={<AltaMenu />} />
        
        {/* Alta - Programas */}
        <Route path="/alta/programas" element={<ProgramasList />} />
        <Route path="/alta/programas/nuevo" element={<ProgramasForm />} />
        <Route path="/alta/programas/:id/editar" element={<ProgramasForm />} />
        
        {/* Alta - Cuatrimestres */}
        <Route path="/alta/cuatrimestres" element={<Cuatrimestres />} />
        <Route path="/alta/cuatrimestres/nuevo" element={<CuatrimestreForm />} />
        <Route path="/alta/cuatrimestres/:id/editar" element={<CuatrimestreForm />} />
        <Route path="/alta/cuatrimestres/lista" element={<CuatrimestreList />} />
        
        {/* Alta - Materias */}
        <Route path="/alta/materias" element={<Materias />} />
        <Route path="/alta/materias/nuevo" element={<MateriaForm />} />
        <Route path="/alta/materias/:id/editar" element={<MateriaForm />} />
        <Route path="/alta/materias/lista" element={<MateriaList />} />
        
        {/* Alta - Docentes */}
        <Route path="/alta/docentes" element={<Docentes />} />
        <Route path="/alta/docentes/nuevo" element={<DocenteForm />} />
        <Route path="/alta/docentes/:id/editar" element={<DocenteForm />} />
        <Route path="/alta/docentes/lista" element={<DocenteList />} />
        
        {/* Alta - Alumnos */}
        <Route path="/alta/alumnos" element={<Alumnos />} />
        <Route path="/alta/alumnos/nuevo" element={<AlumnoForm />} />
        <Route path="/alta/alumnos/:id/editar" element={<AlumnoForm />} />
        <Route path="/alta/alumnos/lista" element={<AlumnoList />} />
        
        {/* Alta - Grupos */}
        <Route path="/alta/grupos" element={<Grupos />} />
        <Route path="/alta/grupos/nuevo" element={<GrupoForm />} />
        <Route path="/alta/grupos/:id/editar" element={<GrupoForm />} />
        <Route path="/alta/grupos/lista" element={<GrupoList />} />
        <Route path="/alta/grupos/:id/alumnos" element={<GrupoForm mode="alumnos" />} />
        <Route path="/alta/grupos/:id/moodle" element={<GrupoForm mode="moodle" />} />

        {/* Módulo Plataforma */}
        <Route path="/plataforma" element={<PlataformaMenu />} />
        
        {/* Ruta principal de la plataforma (con todos los componentes integrados) */}
        <Route path="/plataforma/dashboard" element={<Plataforma />} />
        
        {/* Rutas individuales de componentes de plataforma (si quieres acceso directo) */}
        <Route path="/plataforma/seleccionar" element={<SelectorJerarquico />} />
        <Route path="/plataforma/info-curso/:grupoId" element={<InfoCurso />} />
        <Route path="/plataforma/acciones" element={<PanelAcciones />} />
        <Route path="/plataforma/procesos" element={<EstadoProcesos />} />
        <Route path="/plataforma/resultados" element={<Resultados />} />
        
        {/* Rutas de modales (generalmente no se acceden directamente) */}
        <Route path="/plataforma/modal/usuario/:tipo/:id" element={<ModalCrearUsuarioMoodle />} />
        <Route path="/plataforma/modal/curso/:grupoId" element={<ModalCrearCursoMoodle />} />

        {/* Ruta 404 - Página no encontrada */}
        <Route path="*" element={
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>404 - Página no encontrada</h1>
            <p>La página que buscas no existe.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}