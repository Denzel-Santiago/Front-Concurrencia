class CuatrimestresService {
    constructor() {
        this.baseUrl = 'http://localhost:8000/api/cuatrimestres';
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Listar todos los cuatrimestres
     * @returns {Promise<Array>} Lista de cuatrimestres
     */
    async getAllCuatrimestres() {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al obtener cuatrimestres:', error);
            throw error;
        }
    }

    /**
     * Listar cuatrimestres por programa
     * @param {number} programaId - ID del programa
     * @returns {Promise<Array>} Lista de cuatrimestres del programa
     */
    async getCuatrimestresByPrograma(programaId) {
        try {
            const url = `${this.baseUrl}?programa_id=${programaId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al obtener cuatrimestres por programa:', error);
            throw error;
        }
    }

    /**
     * Obtener cuatrimestre por ID
     * @param {number} id - ID del cuatrimestre
     * @returns {Promise<Object>} Datos del cuatrimestre
     */
    async getCuatrimestreById(id) {
        try {
            const url = `${this.baseUrl}/${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al obtener cuatrimestre por ID:', error);
            throw error;
        }
    }

    /**
     * Crear un nuevo cuatrimestre
     * @param {Object} cuatrimestreData - Datos del cuatrimestre
     * @param {number} cuatrimestreData.programa_id - ID del programa
     * @param {number} cuatrimestreData.numero - Número del cuatrimestre
     * @param {string} cuatrimestreData.nombre - Nombre del cuatrimestre
     * @returns {Promise<Object>} Respuesta del servidor
     */
    async createCuatrimestre(cuatrimestreData) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(cuatrimestreData)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    message: result.message,
                    data: result.data
                };
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al crear cuatrimestre:', error);
            throw error;
        }
    }

    /**
     * Actualizar cuatrimestre existente
     * @param {number} id - ID del cuatrimestre
     * @param {Object} cuatrimestreData - Datos actualizados del cuatrimestre
     * @returns {Promise<Object>} Respuesta del servidor
     */
    async updateCuatrimestre(id, cuatrimestreData) {
        try {
            const url = `${this.baseUrl}/${id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(cuatrimestreData)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    message: result.message
                };
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al actualizar cuatrimestre:', error);
            throw error;
        }
    }

    /**
     * Eliminar cuatrimestre
     * @param {number} id - ID del cuatrimestre a eliminar
     * @returns {Promise<Object>} Respuesta del servidor
     */
    async deleteCuatrimestre(id) {
        try {
            const url = `${this.baseUrl}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    message: result.message
                };
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al eliminar cuatrimestre:', error);
            throw error;
        }
    }

    /**
     * Formatear fecha para mostrar
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Obtener opciones para select de programas (si tienes un servicio de programas)
     * @returns {Promise<Array>} Lista de programas
     */
    async getProgramasOptions() {
        // Aquí puedes integrar con tu servicio de programas si lo tienes
        // Por ahora retornamos un array vacío
        return [];
    }
}

// Exportar la clase para poder usarla en otros archivos
// Si usas módulos ES6:
// export default CuatrimestresService;

// Si usas script tradicional:
// window.CuatrimestresService = CuatrimestresService;