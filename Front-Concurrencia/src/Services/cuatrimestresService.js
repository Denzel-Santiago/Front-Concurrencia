const BASE_URL = 'http://localhost:8000/api/cuatrimestres';

export const cuatrimestresService = {
  // 1. Listar todos los cuatrimestres
  async getAll() {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  // 2. Listar cuatrimestres por programa
  async getByPrograma(programaId) {
    const response = await fetch(`${BASE_URL}?programa_id=${programaId}`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  // 3. Obtener cuatrimestre por ID
  async getById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    return data.success ? data.data : null;
  },

  // 4. Crear cuatrimestre
  async create(cuatrimestreData) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuatrimestreData)
    });
    return await response.json();
  },

  // 5. Actualizar cuatrimestre
  async update(id, cuatrimestreData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuatrimestreData)
    });
    return await response.json();
  },

  // 6. Eliminar cuatrimestre
  async delete(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  }
};