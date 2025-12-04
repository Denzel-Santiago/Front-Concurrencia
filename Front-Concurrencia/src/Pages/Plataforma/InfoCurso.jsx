// src/components/Plataforma/InfoCurso.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
School as MoodleIcon 

} from '@mui/icons-material';
import plataformaService from '../../Services/plataforma.service';

const InfoCurso = ({ grupoId, grupoInfo: initialGrupoInfo }) => {
  const [grupoInfo, setGrupoInfo] = useState(initialGrupoInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estadoSincronizacion, setEstadoSincronizacion] = useState(null);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    if (grupoId && !grupoInfo) {
      cargarGrupoInfo();
    } else if (grupoInfo) {
      verificarEstadoSincronizacion();
    }
  }, [grupoId, grupoInfo]);

  const cargarGrupoInfo = async () => {
    if (!grupoId) return;
    
    try {
      setLoading(true);
      const response = await plataformaService.getGrupoInfo(grupoId);
      
      if (response.success) {
        setGrupoInfo(response.data);
      } else {
        setError('Error al cargar información del grupo');
      }
    } catch (error) {
      console.error('Error cargando grupo:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const verificarEstadoSincronizacion = async () => {
    if (!grupoId || !grupoInfo) return;
    
    try {
      setVerificando(true);
      const response = await plataformaService.verificarEstadoSincronizacion(grupoId);
      
      if (response.success) {
        setEstadoSincronizacion(response.data);
      }
    } catch (error) {
      console.error('Error verificando estado:', error);
    } finally {
      setVerificando(false);
    }
  };

  const handleVerificarClick = () => {
    verificarEstadoSincronizacion();
  };

  const handleRefresh = () => {
    cargarGrupoInfo();
  };

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando información del grupo...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Reintentar
            </Button>
          }>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!grupoInfo) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Selecciona un grupo para ver la información
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    nombre,
    materia_nombre,
    materia_codigo,
    programa_nombre,
    cuatrimestre_numero,
    docente_nombre,
    docente_email,
    docente_id,
    curso_moodle_id,
    total_alumnos,
    cupo_maximo,
    alumnos = []
  } = grupoInfo;

  const porcentajeOcupacion = total_alumnos && cupo_maximo 
    ? Math.round((total_alumnos / cupo_maximo) * 100)
    : 0;

  const alumnosConMoodle = alumnos.filter(a => a.usuario_moodle_id).length;
  const alumnosMatriculados = alumnos.filter(a => a.matriculado_moodle).length;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {nombre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {materia_nombre} ({materia_codigo})
            </Typography>
          </Box>
          
          <Tooltip title="Verificar estado en Moodle">
            <IconButton onClick={handleVerificarClick} disabled={verificando}>
              {verificando ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Estado de sincronización */}
        {estadoSincronizacion && (
          <Alert 
            severity={
              estadoSincronizacion.curso_existe && 
              estadoSincronizacion.docente_existe &&
              estadoSincronizacion.alumnos_sincronizados === total_alumnos
                ? "success" 
                : "warning"
            }
            sx={{ mb: 3 }}
            icon={false}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoodleIcon />
              <Typography variant="body2">
                <strong>Estado Moodle:</strong> 
                {estadoSincronizacion.curso_existe ? ' Curso ✓' : ' Curso ✗'}
                {estadoSincronizacion.docente_existe ? ' | Docente ✓' : ' | Docente ✗'}
                {` | Alumnos: ${alumnosConMoodle}/${total_alumnos}`}
                {estadoSincronizacion.curso_moodle_id && ` (ID: ${estadoSincronizacion.curso_moodle_id})`}
              </Typography>
            </Box>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Información general */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon /> Información del Grupo
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Programa" 
                  secondary={programa_nombre}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cuatrimestre" 
                  secondary={cuatrimestre_numero}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cupo" 
                  secondary={`${total_alumnos || 0} / ${cupo_maximo || 'N/A'}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Ocupación" 
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 4 }}>
                          <Box 
                            sx={{ 
                              width: `${porcentajeOcupacion}%`, 
                              height: '100%', 
                              bgcolor: porcentajeOcupacion > 90 ? 'error.main' : 
                                      porcentajeOcupacion > 70 ? 'warning.main' : 'success.main',
                              borderRadius: 4
                            }} 
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2">{porcentajeOcupacion}%</Typography>
                    </Box>
                  }
                />
              </ListItem>
              {curso_moodle_id && (
                <ListItem>
                  <ListItemIcon>
                    <LinkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="ID Moodle" 
                    secondary={
                      <Chip 
                        label={`Curso #${curso_moodle_id}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    }
                  />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Información del docente */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> Docente
            </Typography>
            
            {docente_nombre ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>{docente_nombre}</strong>
                </Typography>
                {docente_email && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {docente_email}
                  </Typography>
                )}
                {grupoInfo.docente?.usuario_moodle_id && (
                  <Chip 
                    label={`Usuario Moodle #${grupoInfo.docente.usuario_moodle_id}`}
                    size="small"
                    color="success"
                    icon={<CheckCircleIcon />}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No asignado
              </Typography>
            )}
          </Grid>

          {/* Alumnos */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupsIcon /> Alumnos ({total_alumnos || 0})
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip 
                label={`Total: ${total_alumnos || 0}`}
                variant="outlined"
              />
              <Chip 
                label={`Con ID Moodle: ${alumnosConMoodle}`}
                color={alumnosConMoodle === total_alumnos ? "success" : "warning"}
                variant="outlined"
              />
              <Chip 
                label={`Matriculados: ${alumnosMatriculados}`}
                color={alumnosMatriculados === total_alumnos ? "success" : "default"}
                variant="outlined"
              />
            </Box>
            
            {alumnos.length > 0 ? (
              <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                {alumnos.map((alumno) => (
                  <ListItem key={alumno.id} divider>
                    <ListItemIcon>
                      {alumno.usuario_moodle_id ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <ErrorIcon color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={alumno.nombre_completo}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="body2" component="span">
                            {alumno.matricula}
                          </Typography>
                          {alumno.usuario_moodle_id && (
                            <>
                              <Typography variant="body2" component="span" color="primary">
                                • ID Moodle: {alumno.usuario_moodle_id}
                              </Typography>
                              {alumno.matriculado_moodle && (
                                <Chip 
                                  label="Matriculado"
                                  size="small"
                                  color="success"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No hay alumnos inscritos en este grupo
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InfoCurso;