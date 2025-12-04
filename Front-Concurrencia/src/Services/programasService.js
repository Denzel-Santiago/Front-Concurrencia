// services/programasService.js
const API_BASE = "http://localhost:8000/api";

export const programasService = {
  // Obtener todos los programas
  async getAll() {
    try {
      const response = await fetch(`${API_BASE}/programas`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Verificar la estructura de respuesta del backend
      if (result.success) {
        // Transformar datos para compatibilidad con el frontend
        return result.data.map(programa => ({
          id: programa.id,
          nombre: programa.nombre,
          cuatrimestres: programa.cuatrimestres_total,
          estado: "Activo", // Por defecto, si el backend no lo incluye
          created_at: programa.created_at
        }));
      } else {
        throw new Error("Respuesta no exitosa del servidor");
      }
    } catch (error) {
      console.error('Error al obtener programas:', error);
      // Para desarrollo, puedes lanzar el error o retornar datos de prueba
      throw error;
    }
  },

  // Obtener un programa por ID
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE}/programas/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const programa = result.data;
        return {
          id: programa.id,
          nombre: programa.nombre,
          cuatrimestres: programa.cuatrimestres_total,
          estado: "Activo",
          descripcion: "", // Si el backend no incluye descripción
          created_at: programa.created_at
        };
      } else {
        throw new Error("Respuesta no exitosa del servidor");
      }
    } catch (error) {
      console.error(`Error al obtener programa ${id}:`, error);
      throw error;
    }
  },

  // Crear nuevo programa
  async create(programaData) {
    try {
      const response = await fetch(`${API_BASE}/programas`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: programaData.nombre,
          cuatrimestres_total: programaData.cuatrimestres
          // Si necesitas enviar más campos, añádelos aquí
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          message: result.message,
          id: result.data.id
        };
      } else {
        throw new Error(result.message || "Error al crear programa");
      }
    } catch (error) {
      console.error('Error al crear programa:', error);
      throw error;
    }
  },

  // Actualizar programa
  async update(id, programaData) {
    try {
      const response = await fetch(`${API_BASE}/programas/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: programaData.nombre,
          cuatrimestres_total: programaData.cuatrimestres
          // Añadir otros campos si el backend los acepta
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          message: result.message,
          success: true
        };
      } else {
        throw new Error(result.message || "Error al actualizar programa");
      }
    } catch (error) {
      console.error(`Error al actualizar programa ${id}:`, error);
      throw error;
    }
  },

  // Eliminar programa
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE}/programas/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        // Si hay error, intentamos obtener el mensaje del backend
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          message: result.message,
          success: true
        };
      } else {
        throw new Error(result.message || "Error al eliminar programa");
      }
    } catch (error) {
      console.error(`Error al eliminar programa ${id}:`, error);
      throw error;
    }
  },

  // Función de utilidad para obtener datos de prueba (solo desarrollo)
  getMockData() {
    return [
      { id: 1, nombre: "Ingeniería en Sistemas", cuatrimestres: 10, estado: "Activo" },
      { id: 2, nombre: "Administración de Empresas", cuatrimestres: 8, estado: "Activo" },
      { id: 3, nombre: "Derecho", cuatrimestres: 9, estado: "Activo" },
      { id: 4, nombre: "Contaduría Pública", cuatrimestres: 8, estado: "Activo" },
      { id: 5, nombre: "Psicología", cuatrimestres: 9, estado: "Activo" }
    ];
  }
};