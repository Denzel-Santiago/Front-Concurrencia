const BASE_URL = 'http://localhost:8000/api/docentes';

export const docentesService = {
  // 1. Listar todos los docentes
  async getAll() {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener docentes:', error);
      throw error;
    }
  },

  // 2. Listar docentes por especialidad
  async getByEspecialidad(especialidad) {
    try {
      const response = await fetch(`${BASE_URL}?especialidad=${encodeURIComponent(especialidad)}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener docentes por especialidad:', error);
      throw error;
    }
  },

  // 3. Buscar docentes por nombre o email
  async search(query) {
    try {
      const response = await fetch(`${BASE_URL}?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al buscar docentes:', error);
      throw error;
    }
  },

  // 4. Obtener docente por ID
  async getById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al obtener docente:', error);
      throw error;
    }
  },

  // 5. Crear docente
  async create(docenteData) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docenteData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear docente:', error);
      throw error;
    }
  },

  // 6. Actualizar docente
  async update(id, docenteData) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docenteData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar docente:', error);
      throw error;
    }
  },

  // 7. Eliminar docente
  async delete(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar docente:', error);
      throw error;
    }
  },

  // 8. Obtener materias asignadas a un docente
  async getMateriasAsignadas(docenteId) {
    try {
      const docente = await this.getById(docenteId);
      return docente?.materias || [];
    } catch (error) {
      console.error('Error al obtener materias asignadas:', error);
      throw error;
    }
  },

  // 9. Obtener especialidades únicas (para filtros)
  async getEspecialidades() {
    try {
      const docentes = await this.getAll();
      const especialidades = [...new Set(docentes.map(d => d.especialidad).filter(Boolean))];
      return especialidades.sort();
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      throw error;
    }
  }
};