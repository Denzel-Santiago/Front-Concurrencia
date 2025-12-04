// src/services/plataforma.service.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const MOODLE_API_URL = 'http://localhost:8000/api/moodle.php';

class PlataformaService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Interceptor para manejar errores
    this.axiosInstance.interceptors.response.use(
      response => response.data,
      error => {
        console.error('Error en la petición:', error);
        return Promise.reject(error);
      }
    );
  }

  // ========== ENDPOINTS MOODLE ==========
  
  // 1. Verificar curso en Moodle
  async checkCourseInMoodle(courseId) {
    try {
      const response = await axios.get(MOODLE_API_URL, {
        params: {
          action: 'check_course',
          course_id: courseId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checkCourseInMoodle:', error);
      throw error;
    }
  }

  // 2. Verificar usuario en Moodle
  async checkUserInMoodle(userId) {
    try {
      const response = await axios.get(MOODLE_API_URL, {
        params: {
          action: 'check_user',
          user_id: userId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checkUserInMoodle:', error);
      throw error;
    }
  }

  // 3. Crear curso en Moodle
  async createCourseInMoodle(courseData) {
    try {
      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        formData.append(key, courseData[key]);
      });
      formData.append('action', 'create_course');

      const response = await axios.post(MOODLE_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error createCourseInMoodle:', error);
      throw error;
    }
  }

  // 4. Crear usuario en Moodle
  async createUserInMoodle(userData) {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });
      formData.append('action', 'create_user');

      const response = await axios.post(MOODLE_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error createUserInMoodle:', error);
      throw error;
    }
  }

  // 5. Crear cursos concurrentes
  async createCoursesConcurrent(coursesData) {
    try {
      const formData = new FormData();
      Object.keys(coursesData).forEach(key => {
        if (key === 'courses' || key === 'docentes' || key === 'alumnos') {
          formData.append(key, JSON.stringify(coursesData[key]));
        } else {
          formData.append(key, coursesData[key]);
        }
      });
      formData.append('action', 'create_courses_concurrent');

      const response = await axios.post(MOODLE_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error createCoursesConcurrent:', error);
      throw error;
    }
  }

  // 6. Matricular batch en Moodle
  async enrollBatchInMoodle(enrollmentData) {
    try {
      const formData = new FormData();
      Object.keys(enrollmentData).forEach(key => {
        if (key === 'enrollments') {
          formData.append(key, JSON.stringify(enrollmentData[key]));
        } else {
          formData.append(key, enrollmentData[key]);
        }
      });
      formData.append('action', 'enroll_batch');

      const response = await axios.post(MOODLE_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error enrollBatchInMoodle:', error);
      throw error;
    }
  }

  // 7. Obtener estado de hilos
  async getThreadStatus(threadId = null) {
    try {
      const params = { action: 'thread_status' };
      if (threadId) {
        params.thread_id = threadId;
      }
      
      const response = await axios.get(MOODLE_API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error getThreadStatus:', error);
      throw error;
    }
  }

  // 8. Listar acciones disponibles
  async getMoodleActions() {
    try {
      const response = await axios.get(MOODLE_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error getMoodleActions:', error);
      throw error;
    }
  }

  // ========== ENDPOINTS DEL SISTEMA ==========

  // Obtener programas
  async getProgramas() {
    return this.axiosInstance.get('/programas');
  }

  // Obtener cuatrimestres por programa
  async getCuatrimestres(programaId) {
    return this.axiosInstance.get(`/cuatrimestres?programa_id=${programaId}`);
  }

  // Obtener materias por cuatrimestre
  async getMaterias(cuatrimestreId) {
    return this.axiosInstance.get(`/materias?cuatrimestre_id=${cuatrimestreId}`);
  }

  // Obtener grupos por materia
  async getGrupos(materiaId) {
    return this.axiosInstance.get(`/grupos?materia_id=${materiaId}`);
  }

  // Obtener información completa de un grupo
  async getGrupoInfo(grupoId) {
    return this.axiosInstance.get(`/grupos/${grupoId}`);
  }

  // Obtener alumnos de un grupo
  async getAlumnosGrupo(grupoId) {
    return this.axiosInstance.get(`/grupos?action=alumnos&grupo_id=${grupoId}`);
  }

  // Obtener docentes
  async getDocentes() {
    return this.axiosInstance.get('/docentes');
  }

  // Obtener alumnos disponibles para un grupo
  async getAlumnosDisponibles(grupoId) {
    return this.axiosInstance.get(`/grupos?action=disponibles&grupo_id=${grupoId}`);
  }

  // Obtener estadísticas de un grupo
  async getEstadisticasGrupo(grupoId) {
    return this.axiosInstance.get(`/grupos?action=estadisticas&grupo_id=${grupoId}`);
  }

  // Actualizar grupo con ID de Moodle
  async updateGrupoMoodleId(grupoId, moodleId) {
    return this.axiosInstance.put(`/grupos/${grupoId}`, {
      curso_moodle_id: moodleId
    });
  }

  // Actualizar docente con ID de Moodle
  async updateDocenteMoodleId(docenteId, moodleId) {
    return this.axiosInstance.put(`/docentes/${docenteId}`, {
      usuario_moodle_id: moodleId
    });
  }

  // Actualizar alumno con ID de Moodle
  async updateAlumnoMoodleId(alumnoId, moodleId) {
    return this.axiosInstance.put(`/alumnos/${alumnoId}`, {
      usuario_moodle_id: moodleId
    });
  }

  // ========== FUNCIONES DE SINCRONIZACIÓN ==========

  // Sincronizar un solo grupo a Moodle
  async sincronizarGrupoMoodle(grupoId) {
    try {
      // 1. Obtener información del grupo
      const grupoInfo = await this.getGrupoInfo(grupoId);
      
      // 2. Crear curso en Moodle
      const cursoData = {
        fullname: `${grupoInfo.data.materia_nombre} - ${grupoInfo.data.nombre}`,
        shortname: `${grupoInfo.data.materia_codigo}_${grupoInfo.data.nombre.replace(' ', '_')}`,
        categoryid: 1, // ID de categoría por defecto
        visible: 1
      };
      
      const cursoResult = await this.createCourseInMoodle(cursoData);
      
      if (cursoResult.success && cursoResult.data.course_id) {
        // 3. Actualizar grupo con el ID de Moodle
        await this.updateGrupoMoodleId(grupoId, cursoResult.data.course_id);
        
        // 4. Sincronizar docente si existe
        if (grupoInfo.data.docente_id) {
          await this.sincronizarDocenteMoodle(grupoInfo.data.docente_id);
        }
        
        // 5. Sincronizar alumnos del grupo
        const alumnos = await this.getAlumnosGrupo(grupoId);
        if (alumnos.data && alumnos.data.length > 0) {
          await this.sincronizarAlumnosMoodle(alumnos.data, cursoResult.data.course_id);
        }
        
        return {
          success: true,
          message: 'Grupo sincronizado exitosamente',
          data: {
            curso_moodle_id: cursoResult.data.course_id,
            grupo_id: grupoId
          }
        };
      }
      
      return cursoResult;
    } catch (error) {
      console.error('Error sincronizarGrupoMoodle:', error);
      throw error;
    }
  }

  // Sincronizar docente a Moodle
  async sincronizarDocenteMoodle(docenteId) {
    try {
      // Obtener información del docente
      const docenteInfo = await this.axiosInstance.get(`/docentes/${docenteId}`);
      
      if (docenteInfo.data.usuario_moodle_id) {
        // Ya tiene ID de Moodle, verificar si existe
        const checkResult = await this.checkUserInMoodle(docenteInfo.data.usuario_moodle_id);
        if (checkResult.exists) {
          return checkResult;
        }
      }
      
      // Crear usuario en Moodle
      const userData = {
        username: docenteInfo.data.email.split('@')[0],
        password: 'TempPassword123!',
        firstname: docenteInfo.data.nombre_completo.split(' ')[0],
        lastname: docenteInfo.data.nombre_completo.split(' ').slice(1).join(' ') || docenteInfo.data.nombre_completo.split(' ')[0],
        email: docenteInfo.data.email,
        auth: 'manual',
        maildisplay: 0
      };
      
      const userResult = await this.createUserInMoodle(userData);
      
      if (userResult.success && userResult.data.user_id) {
        // Actualizar docente con el ID de Moodle
        await this.updateDocenteMoodleId(docenteId, userResult.data.user_id);
      }
      
      return userResult;
    } catch (error) {
      console.error('Error sincronizarDocenteMoodle:', error);
      throw error;
    }
  }

  // Sincronizar alumnos a Moodle
  async sincronizarAlumnosMoodle(alumnos, courseId = null) {
    try {
      const resultados = [];
      
      for (const alumno of alumnos) {
        try {
          if (alumno.usuario_moodle_id) {
            // Ya tiene ID de Moodle, verificar si existe
            const checkResult = await this.checkUserInMoodle(alumno.usuario_moodle_id);
            if (checkResult.exists) {
              resultados.push({
                alumno_id: alumno.id,
                success: true,
                message: 'Usuario ya existe en Moodle',
                user_id: alumno.usuario_moodle_id
              });
              continue;
            }
          }
          
          // Crear usuario en Moodle
          const userData = {
            username: alumno.matricula,
            password: 'TempPassword123!',
            firstname: alumno.nombre_completo.split(' ')[0],
            lastname: alumno.nombre_completo.split(' ').slice(1).join(' ') || alumno.nombre_completo.split(' ')[0],
            email: alumno.email,
            auth: 'manual',
            maildisplay: 0
          };
          
          const userResult = await this.createUserInMoodle(userData);
          
          if (userResult.success && userResult.data.user_id) {
            // Actualizar alumno con el ID de Moodle
            await this.updateAlumnoMoodleId(alumno.id, userResult.data.user_id);
            
            // Matricular en curso si se especificó
            if (courseId) {
              await this.enrollBatchInMoodle({
                enrollments: [{
                  userid: userResult.data.user_id,
                  courseid: courseId,
                  roleid: 5 // Rol de estudiante
                }]
              });
            }
          }
          
          resultados.push({
            alumno_id: alumno.id,
            ...userResult
          });
        } catch (error) {
          resultados.push({
            alumno_id: alumno.id,
            success: false,
            message: error.message,
            error: error
          });
        }
      }
      
      return {
        success: true,
        data: resultados
      };
    } catch (error) {
      console.error('Error sincronizarAlumnosMoodle:', error);
      throw error;
    }
  }

  // Sincronización masiva de grupos
  async sincronizarGruposMasivo(grupoIds) {
    try {
      const threadData = {
        action: 'create_courses_concurrent',
        grupos: grupoIds,
        timestamp: Date.now()
      };
      
      const result = await this.createCoursesConcurrent(threadData);
      
      if (result.success && result.data.thread_id) {
        // Iniciar monitoreo del hilo
        this.monitorearHilo(result.data.thread_id);
        
        return {
          success: true,
          thread_id: result.data.thread_id,
          message: 'Proceso de sincronización iniciado'
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error sincronizarGruposMasivo:', error);
      throw error;
    }
  }

  // Monitorear estado de hilo
  async monitorearHilo(threadId) {
    const intervalo = setInterval(async () => {
      try {
        const status = await this.getThreadStatus(threadId);
        
        if (status.data.status === 'completed' || status.data.status === 'failed') {
          clearInterval(intervalo);
          
          // Actualizar IDs de Moodle en la base de datos
          if (status.data.status === 'completed' && status.data.results) {
            for (const result of status.data.results) {
              if (result.success && result.grupo_id && result.course_id) {
                await this.updateGrupoMoodleId(result.grupo_id, result.course_id);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error monitoreando hilo:', error);
        clearInterval(intervalo);
      }
    }, 2000); // Verificar cada 2 segundos
  }

  // Verificar estado de sincronización de un grupo
  async verificarEstadoSincronizacion(grupoId) {
    try {
      const grupoInfo = await this.getGrupoInfo(grupoId);
      const estado = {
        grupo_id: grupoId,
        grupo_nombre: grupoInfo.data.nombre,
        materia_nombre: grupoInfo.data.materia_nombre,
        curso_moodle_id: grupoInfo.data.curso_moodle_id,
        docente_moodle_id: grupoInfo.data.docente?.usuario_moodle_id,
        total_alumnos: grupoInfo.data.total_alumnos,
        alumnos_sincronizados: 0
      };
      
      // Verificar si el curso existe en Moodle
      if (estado.curso_moodle_id) {
        try {
          const cursoCheck = await this.checkCourseInMoodle(estado.curso_moodle_id);
          estado.curso_existe = cursoCheck.exists;
          estado.curso_nombre_moodle = cursoCheck.data?.fullname;
        } catch (error) {
          estado.curso_existe = false;
          estado.curso_error = error.message;
        }
      }
      
      // Verificar docente
      if (estado.docente_moodle_id) {
        try {
          const docenteCheck = await this.checkUserInMoodle(estado.docente_moodle_id);
          estado.docente_existe = docenteCheck.exists;
          estado.docente_username = docenteCheck.data?.username;
        } catch (error) {
          estado.docente_existe = false;
        }
      }
      
      // Verificar alumnos
      const alumnos = await this.getAlumnosGrupo(grupoId);
      estado.alumnos_sincronizados = alumnos.data.filter(a => a.usuario_moodle_id).length;
      estado.alumnos_con_moodle_id = alumnos.data.filter(a => a.usuario_moodle_id).map(a => ({
        id: a.id,
        nombre: a.nombre_completo,
        moodle_id: a.usuario_moodle_id,
        matriculado_moodle: a.matriculado_moodle
      }));
      
      return {
        success: true,
        data: estado
      };
    } catch (error) {
      console.error('Error verificarEstadoSincronizacion:', error);
      throw error;
    }
  }
}

export default new PlataformaService();