import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AltaMenu from "../pages/Alta/AltaMenu";
import PlataformaMenu from "../pages/Plataforma/PlataformaMenu";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Módulo de Alta */}
        <Route path="/alta" element={<AltaMenu />} />

        {/* Módulo Plataforma */}
        <Route path="/plataforma" element={<PlataformaMenu />} />
      </Routes>
    </BrowserRouter>
  );
}
