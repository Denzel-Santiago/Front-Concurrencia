// src/components/Plataforma/EstadoProcesos.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  School as MoodleIcon 
} from '@mui/icons-material';
import plataformaService from '../../Services/plataforma.service';

const EstadoProcesos = () => {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedProceso, setExpandedProceso] = useState(null);

  // Intervalo de actualización
  useEffect(() => {
    cargarProcesos();
    
    const intervalo = setInterval(() => {
      cargarProcesos();
    }, 5000); // Actualizar cada 5 segundos
    
    return () => clearInterval(intervalo);
  }, []);

  const cargarProcesos = async () => {
    try {
      setLoading(true);
      const response = await plataformaService.getThreadStatus();
      
      if (response.success) {
        setProcesos(response.data || []);
      } else {
        setError('Error al cargar procesos');
      }
    } catch (error) {
      console.error('Error cargando procesos:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    cargarProcesos();
  };

  const handleExpand = (procesoId) => {
    setExpandedProceso(expandedProceso === procesoId ? null : procesoId);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'running':
        return 'primary';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'running':
        return <ScheduleIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'pending':
        return <PendingIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const formatFecha = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const calcularProgreso = (proceso) => {
    if (proceso.total && proceso.procesados) {
      return Math.round((proceso.procesados / proceso.total) * 100);
    }
    return 0;
  };

  const renderDetallesProceso = (proceso) => {
    if (!proceso.details && !proceso.results) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No hay detalles disponibles
        </Typography>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {/* Información general */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Iniciado
            </Typography>
            <Typography variant="body2">
              {formatFecha(proceso.started_at)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Última actualización
            </Typography>
            <Typography variant="body2">
              {formatFecha(proceso.updated_at)}
            </Typography>
          </Grid>
          {proceso.completed_at && (
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">
                Completado
              </Typography>
              <Typography variant="body2">
                {formatFecha(proceso.completed_at)}
              </Typography>
            </Grid>
          )}
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Duración
            </Typography>
            <Typography variant="body2">
              {proceso.duration ? `${proceso.duration}s` : 'En curso...'}
            </Typography>
          </Grid>
        </Grid>

        {/* Barra de progreso */}
        {proceso.total && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">
                Progreso
              </Typography>
              <Typography variant="caption">
                {proceso.procesados || 0} / {proceso.total}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={calcularProgreso(proceso)} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {/* Resultados detallados */}
        {proceso.results && Array.isArray(proceso.results) && (
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Elemento</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>ID Moodle</TableCell>
                  <TableCell>Mensaje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proceso.results.map((resultado, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {resultado.grupo_nombre || 
                       resultado.curso_nombre || 
                       resultado.username || 
                       `Elemento ${index + 1}`}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={resultado.success ? 'Éxito' : 'Error'}
                        size="small"
                        color={resultado.success ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {resultado.course_id || resultado.user_id || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {resultado.message || resultado.error || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Detalles específicos */}
        {proceso.details && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Detalles:
            </Typography>
            <Typography variant="body2" component="pre" sx={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'monospace',
              fontSize: '0.75rem'
            }}>
              {JSON.stringify(proceso.details, null, 2)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader
        title="Procesos en Ejecución"
        subheader="Monitoreo de sincronización con Moodle"
        avatar={<MoodleIcon />}
        action={
          <Tooltip title="Actualizar">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {procesos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No hay procesos en ejecución
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Los procesos de sincronización aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <Box>
            {procesos.map((proceso) => (
              <Box 
                key={proceso.thread_id} 
                sx={{ 
                  mb: 2, 
                  border: 1, 
                  borderColor: 'divider', 
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                {/* Cabecera del proceso */}
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  onClick={() => handleExpand(proceso.thread_id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getEstadoIcon(proceso.status)}
                    <Box>
                      <Typography variant="subtitle1">
                        {proceso.action || 'Proceso desconocido'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {proceso.thread_id} • Iniciado: {formatFecha(proceso.started_at)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={proceso.status || 'unknown'}
                      color={getEstadoColor(proceso.status)}
                      size="small"
                    />
                    {expandedProceso === proceso.thread_id ? 
                      <ExpandLessIcon /> : 
                      <ExpandMoreIcon />
                    }
                  </Box>
                </Box>
                
                {/* Detalles del proceso */}
                <Collapse in={expandedProceso === proceso.thread_id}>
                  <Box sx={{ p: 2 }}>
                    {renderDetallesProceso(proceso)}
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        )}
        
        {/* Estadísticas */}
        {procesos.length > 0 && (
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {procesos.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Procesos totales
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {procesos.filter(p => p.status === 'running').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    En ejecución
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {procesos.filter(p => p.status === 'completed').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Completados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {procesos.filter(p => p.status === 'failed').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fallidos
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EstadoProcesos;