// src/components/Plataforma/Resultados.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Moodle as MoodleIcon
} from '@mui/icons-material';
import plataformaService from '../../../services/plataforma.service';

const Resultados = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    search: '',
    status: '',
    action: '',
    date_from: '',
    date_to: ''
  });
  
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [accionesDisponibles, setAccionesDisponibles] = useState([]);

  useEffect(() => {
    cargarResultados();
    cargarAccionesDisponibles();
  }, [pagina, filtros]);

  const cargarResultados = async () => {
    try {
      setLoading(true);
      
      // En una implementación real, esto vendría de un endpoint específico
      // Por ahora usamos los procesos completados del thread_status
      const response = await plataformaService.getThreadStatus();
      
      if (response.success) {
        // Filtrar solo los completados/fallidos para historial
        const historial = (response.data || [])
          .filter(p => p.status === 'completed' || p.status === 'failed')
          .map(proceso => ({
            id: proceso.thread_id,
            fecha: proceso.completed_at || proceso.updated_at,
            accion: proceso.action,
            estado: proceso.status,
            detalles: proceso.details,
            resultados: proceso.results,
            duracion: proceso.duration
          }));
        
        setResultados(historial);
        setTotalPaginas(Math.ceil(historial.length / 10));
      } else {
        setError('Error al cargar resultados');
      }
    } catch (error) {
      console.error('Error cargando resultados:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const cargarAccionesDisponibles = async () => {
    try {
      const response = await plataformaService.getMoodleActions();
      if (response.actions) {
        setAccionesDisponibles(response.actions);
      }
    } catch (error) {
      console.error('Error cargando acciones:', error);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
    setPagina(1); // Resetear a primera página al filtrar
  };

  const handleRefresh = () => {
    cargarResultados();
  };

  const handleExport = () => {
    // Implementar exportación a CSV
    const csvContent = convertToCSV(resultados);
    downloadCSV(csvContent, 'resultados_moodle.csv');
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Fecha', 'Acción', 'Estado', 'Duración', 'Resultados'];
    const rows = data.map(item => [
      item.id,
      new Date(item.fecha).toLocaleString(),
      item.accion,
      item.estado,
      item.duracion ? `${item.duracion}s` : 'N/A',
      item.resultados ? item.resultados.length : 0
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEstadoChip = (estado) => {
    switch (estado) {
      case 'completed':
        return (
          <Chip 
            label="Completado" 
            size="small" 
            color="success" 
            icon={<CheckCircleIcon />}
          />
        );
      case 'failed':
        return (
          <Chip 
            label="Fallido" 
            size="small" 
            color="error" 
            icon={<ErrorIcon />}
          />
        );
      case 'running':
        return (
          <Chip 
            label="En ejecución" 
            size="small" 
            color="warning" 
            icon={<ScheduleIcon />}
          />
        );
      default:
        return <Chip label={estado} size="small" />;
    }
  };

  const resultadosFiltrados = resultados.filter(resultado => {
    if (filtros.search && !resultado.id.includes(filtros.search) && 
        !resultado.accion.toLowerCase().includes(filtros.search.toLowerCase())) {
      return false;
    }
    
    if (filtros.status && resultado.estado !== filtros.status) {
      return false;
    }
    
    if (filtros.action && resultado.accion !== filtros.action) {
      return false;
    }
    
    if (filtros.date_from && new Date(resultado.fecha) < new Date(filtros.date_from)) {
      return false;
    }
    
    if (filtros.date_to && new Date(resultado.fecha) > new Date(filtros.date_to)) {
      return false;
    }
    
    return true;
  });

  const resultadosPaginados = resultadosFiltrados.slice(
    (pagina - 1) * 10,
    pagina * 10
  );

  return (
    <Card>
      <CardHeader
        title="Historial de Resultados"
        subheader="Registro de operaciones con Moodle"
        avatar={<MoodleIcon />}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Exportar a CSV">
              <IconButton onClick={handleExport} size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar">
              <IconButton onClick={handleRefresh} size="small" disabled={loading}>
                {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {/* Filtros */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por ID o acción..."
              value={filtros.search}
              onChange={(e) => handleFiltroChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtros.status}
                label="Estado"
                onChange={(e) => handleFiltroChange('status', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="completed">Completado</MenuItem>
                <MenuItem value="failed">Fallido</MenuItem>
                <MenuItem value="running">En ejecución</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Acción</InputLabel>
              <Select
                value={filtros.action}
                label="Acción"
                onChange={(e) => handleFiltroChange('action', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {accionesDisponibles.map((accion, index) => (
                  <MenuItem key={index} value={accion}>
                    {accion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Desde"
              type="date"
              value={filtros.date_from}
              onChange={(e) => handleFiltroChange('date_from', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Hasta"
              type="date"
              value={filtros.date_to}
              onChange={(e) => handleFiltroChange('date_to', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Chip 
                label={`${resultadosFiltrados.length} resultados`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
        
        {/* Tabla de resultados */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando resultados...</Typography>
          </Box>
        ) : resultadosFiltrados.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No hay resultados para mostrar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Los resultados de las operaciones aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Proceso</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Acción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Duración</TableCell>
                    <TableCell>Resultados</TableCell>
                    <TableCell>Detalles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultadosPaginados.map((resultado) => (
                    <TableRow key={resultado.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {resultado.id.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(resultado.fecha).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {resultado.accion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getEstadoChip(resultado.estado)}
                      </TableCell>
                      <TableCell>
                        {resultado.duracion ? `${resultado.duracion}s` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {resultado.resultados ? (
                          <Box>
                            <Chip 
                              label={`${resultado.resultados.filter(r => r.success).length} éxitos`}
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ mr: 0.5 }}
                            />
                            <Chip 
                              label={`${resultado.resultados.filter(r => !r.success).length} errores`}
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Sin resultados
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" onClick={() => {
                            // Implementar modal de detalles
                            console.log('Detalles:', resultado);
                          }}>
                            <FilterListIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Paginación */}
            {totalPaginas > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={totalPaginas} 
                  page={pagina} 
                  onChange={(e, value) => setPagina(value)}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
            
            {/* Estadísticas */}
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">
                      {resultadosFiltrados.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total operaciones
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {resultadosFiltrados.filter(r => r.estado === 'completed').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completadas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="error.main">
                      {resultadosFiltrados.filter(r => r.estado === 'failed').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fallidas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main">
                      {resultadosFiltrados.filter(r => r.estado === 'running').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      En ejecución
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Resultados;