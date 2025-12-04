// src/components/Plataforma/Plataforma.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Home as HomeIcon,
  Moodle as MoodleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Componentes
import SelectorJerarquico from './SelectorJerarquico';
import InfoCurso from './InfoCurso';
import PanelAcciones from './PanelAcciones';
import EstadoProcesos from './EstadoProcesos';
import Resultados from './Resultados';

// Servicio
import plataformaService from '../../../services/plataforma.service';

const Plataforma = () => {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estadoSistema, setEstadoSistema] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Verificar estado del sistema al cargar
  useEffect(() => {
    verificarEstadoSistema();
  }, []);

  const verificarEstadoSistema = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar conexión con backend
      const response = await plataformaService.getMoodleActions();
      
      if (response) {
        setEstadoSistema({
          moodle: true,
          backend: true,
          actions: response.actions || []
        });
      }
    } catch (error) {
      console.error('Error verificando sistema:', error);
      setEstadoSistema({
        moodle: false,
        backend: false,
        error: error.message
      });
      setError('Error de conexión con el servidor. Verifica que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleGrupoSeleccionado = (grupo) => {
    setGrupoSeleccionado(grupo);
  };

  const handleSincronizacionCompletada = (grupoId, resultado) => {
    // Actualizar la información del grupo después de la sincronización
    if (grupoId === grupoSeleccionado?.id) {
      plataformaService.getGrupoInfo(grupoId).then(response => {
        if (response.success) {
          setGrupoSeleccionado(response.data);
        }
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    verificarEstadoSistema();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Conectando con el sistema...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Verificando conexión con Moodle y backend
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Inicio
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <MoodleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Plataforma Moodle
        </Typography>
      </Breadcrumbs>

      {/* Cabecera */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Integración con Moodle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sincronización de grupos, cursos y usuarios con la plataforma Moodle
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar Sistema'}
        </Button>
      </Box>

      {/* Estado del sistema */}
      {estadoSistema && (
        <Alert 
          severity={estadoSistema.moodle && estadoSistema.backend ? "success" : "error"} 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={verificarEstadoSistema}>
              Verificar
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Estado del sistema:</strong>
            {estadoSistema.backend && ' Backend ✓'}
            {estadoSistema.moodle && ' Moodle ✓'}
            {estadoSistema.error && ` Error: ${estadoSistema.error}`}
            {!estadoSistema.backend && !estadoSistema.error && ' Backend ✗ Moodle ✗'}
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Selector jerárquico */}
      <Box sx={{ mb: 4 }}>
        <SelectorJerarquico 
          onGrupoSeleccionado={handleGrupoSeleccionado}
          initialGrupoId={null}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Columna izquierda: Información y acciones */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Información del curso */}
            <Grid item xs={12}>
              <InfoCurso 
                grupoId={grupoSeleccionado?.id}
                grupoInfo={grupoSeleccionado}
              />
            </Grid>

            {/* Panel de acciones */}
            <Grid item xs={12}>
              <PanelAcciones 
                grupoSeleccionado={grupoSeleccionado}
                onSincronizacionCompletada={handleSincronizacionCompletada}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Columna derecha: Procesos y resultados */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Estado de procesos */}
            <Grid item xs={12}>
              <EstadoProcesos />
            </Grid>

            {/* Historial de resultados */}
            <Grid item xs={12}>
              <Resultados />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Footer informativo */}
      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" gutterBottom>
              Endpoints Moodle disponibles
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Crear cursos y usuarios</li>
                <li>Sincronización concurrente</li>
                <li>Matriculación masiva</li>
                <li>Monitoreo de hilos</li>
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" gutterBottom>
              IDs de sincronización
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Los IDs locales se mapean con IDs de Moodle automáticamente.
              Los procesos en segundo plano mantienen la consistencia.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" gutterBottom>
              Notas importantes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Verifica la conexión antes de operar
              <br />
              • Monitorea los procesos en ejecución
              <br />
              • Revisa el historial de resultados
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Plataforma;