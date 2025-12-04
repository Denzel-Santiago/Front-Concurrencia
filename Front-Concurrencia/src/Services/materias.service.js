const BASE_URL = 'http://localhost:8000/api/materias';

export const materiasService = {
  // 1. Listar todas las materias
  async getAll() {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener materias:', error);
      throw error;
    }
  },

  // 2. Listar materias por cuatrimestre
  async getByCuatrimestre(cuatrimestreId) {
    try {
      const response = await fetch(`${BASE_URL}?cuatrimestre_id=${cuatrimestreId}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener materias por cuatrimestre:', error);
      throw error;
    }
  },

  // 3. Obtener materia por ID
  async getById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al obtener materia:', error);
      throw error;
    }
  },

  // 4. Crear materia
  async create(materiaData) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materiaData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  },

  // 5. Actualizar materia
  async update(id, materiaData) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materiaData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar materia:', error);
      throw error;
    }
  },

  // 6. Eliminar materia
  async delete(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      throw error;
    }
  }
};