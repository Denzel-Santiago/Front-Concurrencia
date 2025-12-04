// src/components/Plataforma/modales/ModalCrearCursoMoodle.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel,
  Slider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import plataformaService from '../../../services/plataforma.service';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflow: 'auto'
};

const ModalCrearCursoMoodle = ({ open, onClose, grupoId, grupoInfo, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    shortname: '',
    categoryid: 1,
    visible: 1,
    startdate: Math.floor(Date.now() / 1000),
    enddate: Math.floor(Date.now() / 1000) + (86400 * 180), // 6 meses
    summary: '',
    format: 'topics',
    numsections: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías de Moodle
  useEffect(() => {
    if (open) {
      cargarCategorias();
      prellenarFormulario();
    }
  }, [open, grupoInfo]);

  const cargarCategorias = async () => {
    // En una implementación real, esto vendría de Moodle
    // Por ahora usamos categorías por defecto
    setCategorias([
      { id: 1, name: 'Categoría Principal' },
      { id: 2, name: 'Programas Académicos' },
      { id: 3, name: 'Cursos de Actualización' }
    ]);
  };

  const prellenarFormulario = () => {
    if (grupoInfo) {
      const nombreCurso = `${grupoInfo.materia_nombre} - ${grupoInfo.nombre}`;
      const shortname = `${grupoInfo.materia_codigo}_${grupoInfo.nombre.replace(/\s+/g, '_')}`;
      
      setFormData(prev => ({
        ...prev,
        fullname: nombreCurso,
        shortname: shortname.substring(0, 50), // Limitar a 50 caracteres
        summary: `Curso de ${grupoInfo.materia_nombre} para el grupo ${grupoInfo.nombre}.\nPrograma: ${grupoInfo.programa_nombre}\nCuatrimestre: ${grupoInfo.cuatrimestre_numero}`
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (e.target.type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 1 : 0
      }));
    } else if (e.target.type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullname || !formData.shortname) {
      setError('El nombre completo y el nombre corto son requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await plataformaService.createCourseInMoodle(formData);
      
      if (result.success) {
        setSuccess('Curso creado exitosamente en Moodle');
        
        // Actualizar el grupo local con el ID de Moodle
        if (grupoId && result.data.course_id) {
          try {
            await plataformaService.updateGrupoMoodleId(grupoId, result.data.course_id);
            
            if (onSuccess) {
              onSuccess({
                grupo_id: grupoId,
                curso_moodle_id: result.data.course_id,
                fullname: formData.fullname,
                shortname: formData.shortname
              });
            }
          } catch (updateError) {
            console.error('Error actualizando ID de Moodle:', updateError);
            // No mostramos error porque el curso sí se creó en Moodle
          }
        }
        
        // Cerrar automáticamente después de 2 segundos
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(result.message || 'Error al crear curso en Moodle');
      }
    } catch (error) {
      console.error('Error creando curso en Moodle:', error);
      setError(error.message || 'Error de conexión con Moodle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Crear Curso en Moodle
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {grupoInfo && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Creando curso para: <strong>{grupoInfo.materia_nombre} - {grupoInfo.nombre}</strong>
            <br />
            Programa: {grupoInfo.programa_nombre} | Cuatrimestre: {grupoInfo.cuatrimestre_numero}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre completo del curso *"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                disabled={loading}
                helperText="Nombre completo que se mostrará en Moodle"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre corto *"
                name="shortname"
                value={formData.shortname}
                onChange={handleChange}
                required
                disabled={loading}
                helperText="Nombre corto para identificarlo fácilmente"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoryid"
                  value={formData.categoryid}
                  label="Categoría"
                  onChange={handleChange}
                  disabled={loading}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Formato del curso</InputLabel>
                <Select
                  name="format"
                  value={formData.format}
                  label="Formato del curso"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="topics">Formato de temas</MenuItem>
                  <MenuItem value="weeks">Formato semanal</MenuItem>
                  <MenuItem value="social">Formato social</MenuItem>
                  <MenuItem value="singleactivity">Actividad única</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción del curso"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
                helperText="Descripción que aparecerá en la página del curso"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography gutterBottom>
                Número de secciones: {formData.numsections}
              </Typography>
              <Slider
                value={formData.numsections}
                onChange={handleSliderChange('numsections')}
                aria-labelledby="numsections-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={20}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Fecha de inicio: {formatDate(formData.startdate)}
              </Typography>
              <TextField
                fullWidth
                type="date"
                name="startdate"
                value={new Date(formData.startdate * 1000).toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    startdate: Math.floor(date.getTime() / 1000)
                  }));
                }}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Fecha de fin: {formatDate(formData.enddate)}
              </Typography>
              <TextField
                fullWidth
                type="date"
                name="enddate"
                value={new Date(formData.enddate * 1000).toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    enddate: Math.floor(date.getTime() / 1000)
                  }));
                }}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.visible === 1}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visible: e.target.checked ? 1 : 0
                    }))}
                    name="visible"
                    disabled={loading}
                  />
                }
                label="Curso visible para los estudiantes"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Creando...' : 'Crear Curso'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCrearCursoMoodle;