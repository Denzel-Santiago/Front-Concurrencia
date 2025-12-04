// servicios/grupos.service.js
const API_URL = 'http://localhost:8000/api';

class GruposService {
  // ==================== OPERACIONES CRUD BÁSICAS ====================

  // Listar todos los grupos
  async getAll() {
    try {
      const response = await fetch(`${API_URL}/grupos`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener grupos');
      }
    } catch (error) {
      console.error('Error en gruposService.getAll:', error);
      throw error;
    }
  }

  // Obtener grupo por ID (con alumnos)
  async getById(id) {
    try {
      const response = await fetch(`${API_URL}/grupos/${id}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || `Error al obtener grupo con ID ${id}`);
      }
    } catch (error) {
      console.error('Error en gruposService.getById:', error);
      throw error;
    }
  }

  // Crear nuevo grupo
  async create(grupoData) {
    try {
      const response = await fetch(`${API_URL}/grupos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grupoData)
      });
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: result.message,
          data: result.data
        };
      } else {
        return {
          success: false,
          message: result.message || 'Error al crear el grupo'
        };
      }
    } catch (error) {
      console.error('Error en gruposService.create:', error);
      return {
        success: false,
        message: 'Error de conexión al crear grupo'
      };
    }
  }

  // Actualizar grupo existente
  async update(id, grupoData) {
    try {
      const response = await fetch(`${API_URL}/grupos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grupoData)
      });
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || 'Error al actualizar el grupo'
        };
      }
    } catch (error) {
      console.error('Error en gruposService.update:', error);
      return {
        success: false,
        message: 'Error de conexión al actualizar grupo'
      };
    }
  }

  // Eliminar grupo
  async delete(id) {
    try {
      const response = await fetch(`${API_URL}/grupos/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || 'Error al eliminar el grupo'
        };
      }
    } catch (error) {
      console.error('Error en gruposService.delete:', error);
      return {
        success: false,
        message: 'Error de conexión al eliminar grupo'
      };
    }
  }

  // ==================== FILTROS ESPECÍFICOS ====================

  // Listar grupos por materia
  async getByMateria(materiaId) {
    try {
      const response = await fetch(`${API_URL}/grupos?materia_id=${materiaId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener grupos por materia');
      }
    } catch (error) {
      console.error('Error en gruposService.getByMateria:', error);
      throw error;
    }
  }

  // Listar grupos por docente
  async getByDocente(docenteId) {
    try {
      const response = await fetch(`${API_URL}/grupos?docente_id=${docenteId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener grupos por docente');
      }
    } catch (error) {
      console.error('Error en gruposService.getByDocente:', error);
      throw error;
    }
  }

  // Filtrar grupos con múltiples parámetros
  async getWithFilters(filters = {}) {
    try {
      // Construir query string dinámicamente
      const queryParams = new URLSearchParams();
      
      // Agregar filtros que estén presentes
      if (filters.materiaId) queryParams.append('materia_id', filters.materiaId);
      if (filters.docenteId) queryParams.append('docente_id', filters.docenteId);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.action) queryParams.append('action', filters.action);
      if (filters.grupoId) queryParams.append('grupo_id', filters.grupoId);
      
      const queryString = queryParams.toString();
      const url = queryString ? `${API_URL}/grupos?${queryString}` : `${API_URL}/grupos`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al filtrar grupos');
      }
    } catch (error) {
      console.error('Error en gruposService.getWithFilters:', error);
      throw error;
    }
  }

  // ==================== GESTIÓN DE ALUMNOS EN GRUPOS ====================

  // Obtener alumnos de un grupo
  async getAlumnosByGrupo(grupoId) {
    try {
      const response = await fetch(`${API_URL}/grupos?action=alumnos&grupo_id=${grupoId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener alumnos del grupo');
      }
    } catch (error) {
      console.error('Error en gruposService.getAlumnosByGrupo:', error);
      throw error;
    }
  }

  // Obtener alumnos disponibles para un grupo (no inscritos)
  async getAlumnosDisponibles(grupoId) {
    try {
      const response = await fetch(`${API_URL}/grupos?action=disponibles&grupo_id=${grupoId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener alumnos disponibles');
      }
    } catch (error) {
      console.error('Error en gruposService.getAlumnosDisponibles:', error);
      throw error;
    }
  }

  // Asignar alumno a grupo
  async asignarAlumno(grupoId, alumnoId) {
    try {
      const response = await fetch(`${API_URL}/grupos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'asignar_alumno',
          grupo_id: grupoId,
          alumno_id: alumnoId
        })
      });
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: result.message,
          data: result.data
        };
      } else {
        return {
          success: false,
          message: result.message || 'Error al asignar alumno al grupo'
        };
      }
    } catch (error) {
      console.error('Error en gruposService.asignarAlumno:', error);
      return {
        success: false,
        message: 'Error de conexión al asignar alumno'
      };
    }
  }

  // Desasignar alumno de grupo
  async desasignarAlumno(grupoId, alumnoId) {
    try {
      const response = await fetch(`${API_URL}/grupos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'desasignar_alumno',
          grupo_id: grupoId,
          alumno_id: alumnoId
        })
      });
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || 'Error al desasignar alumno del grupo'
        };
      }
    } catch (error) {
      console.error('Error en gruposService.desasignarAlumno:', error);
      return {
        success: false,
        message: 'Error de conexión al desasignar alumno'
      };
    }
  }

  // ==================== ESTADÍSTICAS E INFORMES ====================

  // Obtener estadísticas de un grupo
  async getEstadisticas(grupoId) {
    try {
      const response = await fetch(`${API_URL}/grupos?action=estadisticas&grupo_id=${grupoId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Error al obtener estadísticas del grupo');
      }
    } catch (error) {
      console.error('Error en gruposService.getEstadisticas:', error);
      throw error;
    }
  }

  // ==================== MÉTODOS DE AYUDA ====================

  // Formatear datos de grupo para formulario
  formatForForm(grupoData) {
    return {
      nombre: grupoData.nombre || '',
      materia_id: grupoData.materia_id || '',
      docente_id: grupoData.docente_id || '',
      cupo_maximo: grupoData.cupo_maximo || 25
    };
  }

  // Validar datos de grupo antes de enviar
  validateGrupoData(grupoData) {
    const errors = [];

    if (!grupoData.nombre || grupoData.nombre.trim().length < 2) {
      errors.push('El nombre del grupo debe tener al menos 2 caracteres');
    }

    if (!grupoData.materia_id) {
      errors.push('Debe seleccionar una materia');
    }

    if (!grupoData.docente_id) {
      errors.push('Debe seleccionar un docente');
    }

    if (!grupoData.cupo_maximo || grupoData.cupo_maximo < 1 || grupoData.cupo_maximo > 100) {
      errors.push('El cupo máximo debe estar entre 1 y 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generar nombre de grupo sugerido
  async generateSuggestedName(materiaId, docenteId) {
    try {
      // Obtener información de materia y docente para sugerir nombre
      const [gruposMateria, materiaInfo, docenteInfo] = await Promise.all([
        this.getByMateria(materiaId),
        // Necesitarías servicios de materias y docentes aquí
        // Por ahora retornamos un nombre genérico
        Promise.resolve({ nombre: 'Materia' }),
        Promise.resolve({ nombre: 'Docente' })
      ]);

      // Contar grupos existentes para esta materia
      const nextNumber = gruposMateria ? gruposMateria.length + 1 : 1;
      
      // Formato sugerido: "Materia - Grupo X"
      return `${materiaInfo.nombre} - Grupo ${nextNumber}`;
    } catch (error) {
      console.error('Error al generar nombre sugerido:', error);
      return 'Nuevo Grupo';
    }
  }
}

// Crear instancia única del servicio
const gruposService = new GruposService();

// Exportar tanto la clase como la instancia
export { GruposService, gruposService };
export default gruposService;