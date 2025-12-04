const BASE_URL = 'http://localhost:8000/api/cuatrimestres';

export const cuatrimestresService = {
  // Listar todos los cuatrimestres
  async getAll() {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener cuatrimestres:', error);
      throw error;
    }
  },

  // Listar cuatrimestres por programa
  async getByPrograma(programaId) {
    try {
      const response = await fetch(`${BASE_URL}?programa_id=${programaId}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener cuatrimestres por programa:', error);
      throw error;
    }
  },

  // Obtener cuatrimestre por ID
  async getById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al obtener cuatrimestre:', error);
      throw error;
    }
  },

  // Crear nuevo cuatrimestre
  async create(cuatrimestreData) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cuatrimestreData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear cuatrimestre:', error);
      throw error;
    }
  },

  // Actualizar cuatrimestre
  async update(id, cuatrimestreData) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cuatrimestreData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar cuatrimestre:', error);
      throw error;
    }
  },

  // Eliminar cuatrimestre
  async delete(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar cuatrimestre:', error);
      throw error;
    }
  },
};