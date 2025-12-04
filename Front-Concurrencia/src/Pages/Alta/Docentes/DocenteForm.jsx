import { useState, useEffect } from "react";
import { docentesService } from "../../../Services/docentes.service";

export default function DocenteForm({ onDocenteCreated }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim() || !email.trim() || !especialidad.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const docenteData = {
        nombre_completo: nombre.trim(),
        email: email.trim(),
        especialidad: especialidad.trim()
      };

      const result = await docentesService.create(docenteData);

      if (result.success) {
        setNombre("");
        setEmail("");
        setEspecialidad("");
        setSuccess(true);
        
        if (onDocenteCreated) onDocenteCreated();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || "Error al crear el docente");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Registrar Docente</h2>

      {/* Mensajes de estado */}
      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">¡Docente creado exitosamente!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="font-semibold block mb-1">Nombre Completo</label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Dr. Juan Pérez González"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: juan.perez@universidad.edu"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Especialidad</label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Ej: Programación, Base de Datos, Matemáticas"
            required
            disabled={loading}
          />
        </div>

        {/* Vista previa */}
        {nombre && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-gray-600 text-sm mb-1">Vista previa:</p>
            <p className="font-medium">
              {nombre} - {especialidad}
            </p>
            <p className="text-gray-600 text-sm">{email}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"
          } text-white`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            "Registrar Docente"
          )}
        </button>
      </form>
    </div>
  );
}