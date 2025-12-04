const BASE_URL = 'http://localhost:8000/api/alumnos';

export const alumnosService = {
  // 1. Listar todos los alumnos
  async getAll() {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      throw error;
    }
  },

  // 2. Listar alumnos por programa
  async getByPrograma(programaId) {
    try {
      const response = await fetch(`${BASE_URL}?programa_id=${programaId}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener alumnos por programa:', error);
      throw error;
    }
  },

  // 3. Listar alumnos por cuatrimestre
  async getByCuatrimestre(cuatrimestre) {
    try {
      const response = await fetch(`${BASE_URL}?cuatrimestre_actual=${cuatrimestre}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener alumnos por cuatrimestre:', error);
      throw error;
    }
  },

  // 4. Buscar alumnos por nombre, matrícula o email
  async search(query) {
    try {
      const response = await fetch(`${BASE_URL}?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al buscar alumnos:', error);
      throw error;
    }
  },

  // 5. Filtros combinados (programa + cuatrimestre + búsqueda)
  async getWithFilters({ programaId, cuatrimestre, search }) {
    try {
      let url = BASE_URL + '?';
      const params = [];
      
      if (programaId) params.push(`programa_id=${programaId}`);
      if (cuatrimestre) params.push(`cuatrimestre_actual=${cuatrimestre}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      
      url += params.join('&');
      
      const response = await fetch(url);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al filtrar alumnos:', error);
      throw error;
    }
  },

  // 6. Obtener alumno por ID
  async getById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al obtener alumno:', error);
      throw error;
    }
  },

  // 7. Crear alumno
  async create(alumnoData) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumnoData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear alumno:', error);
      throw error;
    }
  },

  // 8. Actualizar alumno
  async update(id, alumnoData) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumnoData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar alumno:', error);
      throw error;
    }
  },

  // 9. Eliminar alumno
  async delete(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
      throw error;
    }
  },

  // 10. Obtener estadísticas de alumnos
  async getEstadisticas() {
    try {
      const alumnos = await this.getAll();
      return {
        total: alumnos.length,
        porPrograma: this._contarPorPrograma(alumnos),
        porCuatrimestre: this._contarPorCuatrimestre(alumnos),
        promedioInscripciones: this._calcularPromedioInscripciones(alumnos)
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Métodos privados para estadísticas
  _contarPorPrograma(alumnos) {
    const conteo = {};
    alumnos.forEach(alumno => {
      const programa = alumno.programa_nombre || 'Sin programa';
      conteo[programa] = (conteo[programa] || 0) + 1;
    });
    return conteo;
  },

  _contarPorCuatrimestre(alumnos) {
    const conteo = {};
    alumnos.forEach(alumno => {
      const cuatrimestre = alumno.cuatrimestre_actual || 0;
      conteo[cuatrimestre] = (conteo[cuatrimestre] || 0) + 1;
    });
    return conteo;
  },

  _calcularPromedioInscripciones(alumnos) {
    if (alumnos.length === 0) return 0;
    const total = alumnos.reduce((sum, alumno) => sum + (alumno.inscripciones_activas || 0), 0);
    return (total / alumnos.length).toFixed(1);
  },

  // 11. Obtener alumnos próximos a graduarse (último cuatrimestre)
  async getProximosAGraduarse() {
    try {
      const alumnos = await this.getAll();
      return alumnos.filter(alumno => {
        const cuatrimestreActual = alumno.cuatrimestre_actual || 0;
        const cuatrimestresTotal = alumno.cuatrimestres_total || 10;
        return cuatrimestreActual >= cuatrimestresTotal - 1;
      });
    } catch (error) {
      console.error('Error al obtener próximos a graduarse:', error);
      throw error;
    }
  }
};