import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AltaMenu from "../pages/Alta/AltaMenu";
import PlataformaMenu from "../pages/Plataforma/PlataformaMenu";
import ProgramasList from "../Pages/Alta/ProgramasList";
import ProgramasForm from "../Pages/Alta/ProgramasForm";
import Cuatrimestres from "../Pages/Alta/Cuatrimestre/Cuatrimestres";
import CuatrimestreForm from "../Pages/Alta/Cuatrimestre/CuatrimestreForm";
import CuatrimestreList from "../Pages/Alta/Cuatrimestre/CuatrimestreList";
import MateriaForm from "../Pages/Alta/Materias/MateriaForm";
import MateriaList from "../Pages/Alta/Materias/MateriaList";
import Materias from "../Pages/Alta/Materias/Materias";
import Docentes from "../Pages/Alta/Docentes/Docentes";
import DocenteList from "../Pages/Alta/Docentes/DocenteList";
import DocenteForm from "../Pages/Alta/Docentes/DocenteForm";
import Alumnos from "../Pages/Alta/Alumnos/Alumnos";
import AlumnoList from "../Pages/Alta/Alumnos/AlumnoList";
import AlumnoForm from "../Pages/Alta/Alumnos/AlumnoForm";
import GrupoForm from "../Pages/Alta/Grupos/GrupoForm";
import GrupoList from "../Pages/Alta/Grupos/GrupoList";
import Grupos from "../Pages/Alta/Grupos/Grupos";
import Plataforma from "../Pages/Plataforma/Plataforma";
import EstadoProcesos from "../Pages/Plataforma/EstadoProcesos";
import Resultados from "../Pages/Plataforma/Resultados";
import InfoCurso from "../Pages/Plataforma/InfoCurso";
import SelectorJerarquico from "../Pages/Plataforma/SelectorJerarquico";
import PanelAcciones from "../Pages/Plataforma/PanelAcciones";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        
        {/* Módulo de Alta */}
        <Route path="/alta" element={<AltaMenu />} />

        {/* Módulo Plataforma */}
        <Route path="/plataforma" element={<PlataformaMenu />} />

       {/* Alta - Programas */}
      <Route path="/alta/programas" element={<ProgramasList />} />
      <Route path="/alta/programas/nuevo" element={<ProgramasForm />} />
      <Route path="/alta/programas/:id/editar" element={<ProgramasForm />} />

      {/*Rutas de Cuatrimestres*/}
      <Route path="/alta/cuatrimestres" element={<Cuatrimestres />} />
      <Route path="/alta/cuatrimestres/nuevo" element={<CuatrimestreForm />} />
      <Route path="/alta/cuatrimestres/lista" element={<CuatrimestreList />} />

      {/* Rutas de Materias */}
      <Route path="/alta/materias" element={<Materias />} />
      <Route path="/alta/materias/form" element={<MateriaForm />} />
      <Route path="/alta/materias/lista" element={<MateriaList />} />
      {/* Rutas de Docentes */}
      <Route path="/alta/docentes" element={<Docentes />} />
      <Route path="/alta/docentes/lista" element={<DocenteList />} />
      <Route path="/alta/docentes/form" element={<DocenteForm />} />
      {/* Rutas de Alumnos */}
      <Route path="/alta/alumnos" element={<Alumnos />} />
      <Route path="/alta/alumnos/lista" element={<AlumnoList />} />
      <Route path="/alta/alumnos/form" element={<AlumnoForm />} />
      {/* Rutas de Grupos */}
      <Route path="/alta/grupos" element={<Grupos />} />
      <Route path="/alta/grupos/lista" element={<GrupoList />} />
      <Route path="/alta/grupos/form" element={<GrupoForm />} />

      {/* Plataforma */}
      <Route path="/plataforma" element={<Plataforma />} />
      <Route path="/plataforma/estado-procesos" element={<EstadoProcesos />} />
      <Route path="/plataforma/resultados" element={<Resultados />} />
      <Route path="/plataforma/info-curso" element={<InfoCurso />} />
      <Route path="/plataforma/selector-jerarquico" element={<SelectorJerarquico />} />
      <Route path="/plataforma/panel-acciones" element={<PanelAcciones />} />
      


      

      </Routes>
    </BrowserRouter>
  );
}
