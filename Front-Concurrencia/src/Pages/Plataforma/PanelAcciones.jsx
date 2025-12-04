// src/components/Plataforma/PanelAcciones.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Box,
  Alert,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Sync as SyncIcon,
  GroupAdd as GroupAddIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Refresh as RefreshIcon,
  School as MoodleIcon 
} from '@mui/icons-material';
import plataformaService from '../../Services/plataforma.service';
import ModalCrearUsuarioMoodle from '../Plataforma/ModalCrearCursoMoodle';
import ModalCrearCursoMoodle from './modales/ModalCrearCursoMoodle';

const PanelAcciones = ({ grupoSeleccionado, onSincronizacionCompletada }) => {
  const [loading, setLoading] = useState({
    sincronizar: false,
    verificar: false,
    masivo: false,
    alumnos: false
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalAbierto, setModalAbierto] = useState({
    crearUsuario: false,
    crearCurso: false,
    matricularAlumnos: false,
    sincronizacionMasiva: false
  });
  
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);
  const [gruposMasivos, setGruposMasivos] = useState([]);
  const [resultadoSincronizacion, setResultadoSincronizacion] = useState(null);

  const handleSincronizarGrupo = async () => {
    if (!grupoSeleccionado?.id) {
      setError('Selecciona un grupo primero');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, sincronizar: true }));
      setError(null);
      setSuccess(null);

      const resultado = await plataformaService.sincronizarGrupoMoodle(grupoSeleccionado.id);
      
      if (resultado.success) {
        setSuccess('Grupo sincronizado exitosamente con Moodle');
        setResultadoSincronizacion(resultado.data);
        
        if (onSincronizacionCompletada) {
          onSincronizacionCompletada(grupoSeleccionado.id, resultado.data);
        }
      } else {
        setError(resultado.message || 'Error al sincronizar grupo');
      }
    } catch (error) {
      console.error('Error sincronizando grupo:', error);
      setError(error.message || 'Error de conexión con Moodle');
    } finally {
      setLoading(prev => ({ ...prev, sincronizar: false }));
    }
  };

  const handleVerificarEstado = async () => {
    if (!grupoSeleccionado?.id) {
      setError('Selecciona un grupo primero');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, verificar: true }));
      setError(null);
      setSuccess(null);

      const resultado = await plataformaService.verificarEstadoSincronizacion(grupoSeleccionado.id);
      
      if (resultado.success) {
        setSuccess('Estado verificado exitosamente');
        setResultadoSincronizacion(resultado.data);
      } else {
        setError(resultado.message || 'Error al verificar estado');
      }
    } catch (error) {
      console.error('Error verificando estado:', error);
      setError(error.message || 'Error de conexión con Moodle');
    } finally {
      setLoading(prev => ({ ...prev, verificar: false }));
    }
  };

  const handleCrearUsuarioMoodle = (tipo) => {
    if (!grupoSeleccionado) {
      setError('Selecciona un grupo primero');
      return;
    }

    setTipoUsuario(tipo);
    setModalAbierto(prev => ({ ...prev, crearUsuario: true }));
  };

  const handleCrearCursoMoodle = () => {
    if (!grupoSeleccionado) {
      setError('Selecciona un grupo primero');
      return;
    }

    setModalAbierto(prev => ({ ...prev, crearCurso: true }));
  };

  const handleSincronizacionMasiva = () => {
    setModalAbierto(prev => ({ ...prev, sincronizacionMasiva: true }));
  };

  const handleMatricularAlumnos = async () => {
    if (!grupoSeleccionado?.id || !grupoSeleccionado?.curso_moodle_id) {
      setError('El grupo debe tener un curso en Moodle para matricular alumnos');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, alumnos: true }));
      setError(null);
      setSuccess(null);

      // Obtener alumnos del grupo
      const alumnosResponse = await plataformaService.getAlumnosGrupo(grupoSeleccionado.id);
      
      if (alumnosResponse.success) {
        const alumnosConMoodle = alumnosResponse.data.filter(a => a.usuario_moodle_id);
        
        if (alumnosConMoodle.length === 0) {
          setError('No hay alumnos con ID de Moodle en este grupo');
          return;
        }

        // Preparar matrículas
        const enrollments = alumnosConMoodle.map(alumno => ({
          userid: alumno.usuario_moodle_id,
          courseid: grupoSeleccionado.curso_moodle_id,
          roleid: 5 // Rol de estudiante
        }));

        const resultado = await plataformaService.enrollBatchInMoodle({ enrollments });
        
        if (resultado.success) {
          setSuccess(`${alumnosConMoodle.length} alumnos matriculados exitosamente`);
        } else {
          setError(resultado.message || 'Error al matricular alumnos');
        }
      }
    } catch (error) {
      console.error('Error matriculando alumnos:', error);
      setError(error.message || 'Error de conexión con Moodle');
    } finally {
      setLoading(prev => ({ ...prev, alumnos: false }));
    }
  };

  const handleCerrarModal = (modal) => {
    setModalAbierto(prev => ({ ...prev, [modal]: false }));
  };

  const handleSuccessUsuario = (data) => {
    setSuccess(`Usuario creado exitosamente (ID Moodle: ${data.moodle_id})`);
    if (onSincronizacionCompletada) {
      onSincronizacionCompletada(grupoSeleccionado.id, data);
    }
  };

  const handleSuccessCurso = (data) => {
    setSuccess(`Curso creado exitosamente (ID Moodle: ${data.curso_moodle_id})`);
    if (onSincronizacionCompletada) {
      onSincronizacionCompletada(grupoSeleccionado.id, data);
    }
  };

  const acciones = [
    {
      id: 'sincronizar-completo',
      icon: <SyncIcon />,
      label: 'Sincronizar Grupo Completo',
      descripcion: 'Crea curso, docente y alumnos en Moodle',
      color: 'primary',
      disabled: !grupoSeleccionado,
      onClick: handleSincronizarGrupo,
      loading: loading.sincronizar
    },
    {
      id: 'crear-curso',
      icon: <CloudUploadIcon />,
      label: 'Crear Solo Curso',
      descripcion: 'Crear solo el curso en Moodle',
      color: 'secondary',
      disabled: !grupoSeleccionado,
      onClick: handleCrearCursoMoodle
    },
    {
      id: 'crear-docente',
      icon: <PersonAddIcon />,
      label: 'Crear Docente',
      descripcion: 'Crear usuario para el docente',
      color: 'info',
      disabled: !grupoSeleccionado?.docente_id,
      onClick: () => handleCrearUsuarioMoodle('docente')
    },
    {
      id: 'matricular-alumnos',
      icon: <GroupAddIcon />,
      label: 'Matricular Alumnos',
      descripcion: 'Matricular alumnos en el curso',
      color: 'success',
      disabled: !grupoSeleccionado?.curso_moodle_id,
      onClick: handleMatricularAlumnos,
      loading: loading.alumnos
    },
    {
      id: 'verificar-estado',
      icon: <CheckCircleIcon />,
      label: 'Verificar Estado',
      descripcion: 'Verificar estado en Moodle',
      color: 'warning',
      disabled: !grupoSeleccionado,
      onClick: handleVerificarEstado,
      loading: loading.verificar
    },
    {
      id: 'sincronizacion-masiva',
      icon: <PlaylistAddCheckIcon />,
      label: 'Sincronización Masiva',
      descripcion: 'Sincronizar múltiples grupos',
      color: 'error',
      onClick: handleSincronizacionMasiva,
      loading: loading.masivo
    }
  ];

  return (
    <>
      <Card>
        <CardHeader 
          title="Acciones Moodle"
          subheader="Sincronización con la plataforma"
          avatar={<MoodleIcon />}
        />
        
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}
          
          {grupoSeleccionado && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Grupo seleccionado:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={grupoSeleccionado.nombre} size="small" />
                <Chip label={grupoSeleccionado.materia_nombre} size="small" variant="outlined" />
                {grupoSeleccionado.curso_moodle_id && (
                  <Chip 
                    label={`Moodle: #${grupoSeleccionado.curso_moodle_id}`}
                    size="small"
                    color="success"
                    icon={<CheckCircleIcon />}
                  />
                )}
              </Box>
            </Box>
          )}
          
          <Grid container spacing={2}>
            {acciones.map((accion) => (
              <Grid item xs={12} sm={6} md={4} key={accion.id}>
                <Button
                  fullWidth
                  variant="contained"
                  color={accion.color}
                  startIcon={accion.loading ? <CircularProgress size={20} color="inherit" /> : accion.icon}
                  onClick={accion.onClick}
                  disabled={accion.disabled || accion.loading}
                  sx={{
                    height: '100%',
                    minHeight: 100,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    {accion.label}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {accion.descripcion}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
          
          {resultadoSincronizacion && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Resultado de la sincronización:
              </Typography>
              <Alert severity="info" icon={false}>
                <pre style={{ margin: 0, fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(resultadoSincronizacion, null, 2)}
                </pre>
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      {grupoSeleccionado?.docente_id && (
        <ModalCrearUsuarioMoodle
          open={modalAbierto.crearUsuario && tipoUsuario === 'docente'}
          onClose={() => handleCerrarModal('crearUsuario')}
          tipoUsuario="docente"
          usuarioId={grupoSeleccionado.docente_id}
          onSuccess={handleSuccessUsuario}
        />
      )}

      <ModalCrearCursoMoodle
        open={modalAbierto.crearCurso}
        onClose={() => handleCerrarModal('crearCurso')}
        grupoId={grupoSeleccionado?.id}
        grupoInfo={grupoSeleccionado}
        onSuccess={handleSuccessCurso}
      />

      {/* Modal para sincronización masiva */}
      <Dialog 
        open={modalAbierto.sincronizacionMasiva} 
        onClose={() => handleCerrarModal('sincronizacionMasiva')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlaylistAddCheckIcon />
            Sincronización Masiva
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Selecciona múltiples grupos para sincronizar con Moodle de manera concurrente.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Esta operación se ejecutará en segundo plano. Puedes monitorear el progreso en el panel de procesos.
          </Alert>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Seleccionar grupos</InputLabel>
            <Select
              multiple
              value={gruposMasivos}
              onChange={(e) => setGruposMasivos(e.target.value)}
              label="Seleccionar grupos"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={`Grupo #${value}`} size="small" />
                  ))}
                </Box>
              )}
            >
              {/* En una implementación real, cargaríamos los grupos disponibles */}
              <MenuItem value={1}>Grupo A - Programación I</MenuItem>
              <MenuItem value={2}>Grupo B - Base de Datos</MenuItem>
              <MenuItem value={3}>Grupo C - Redes</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCerrarModal('sincronizacionMasiva')}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            disabled={gruposMasivos.length === 0}
            onClick={() => {
              // Implementar sincronización masiva
              handleCerrarModal('sincronizacionMasiva');
            }}
          >
            Iniciar Sincronización
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PanelAcciones;