import React, { useState } from 'react';
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
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import plataformaService from '../../../Services/plataforma.service';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflow: 'auto'
};

const ModalCrearUsuarioMoodle = ({ open, onClose, tipoUsuario, usuarioId, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: 'TempPassword123!',
    firstname: '',
    lastname: '',
    email: '',
    auth: 'manual',
    maildisplay: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generarPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.firstname) {
      setError('Los campos username, email y nombre son requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await plataformaService.createUserInMoodle(formData);
      
      if (result.success) {
        setSuccess('Usuario creado exitosamente en Moodle');
        
        if (onSuccess) {
          onSuccess({
            local_id: usuarioId,
            moodle_id: result.data.user_id,
            username: formData.username,
            tipo: tipoUsuario
          });
        }
        
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(result.message || 'Error al crear usuario en Moodle');
      }
    } catch (error) {
      console.error('Error creando usuario en Moodle:', error);
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
            Crear Usuario en Moodle
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre *"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido *"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="text"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={generarPassword}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                Generar
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Método de autenticación</InputLabel>
                <Select
                  name="auth"
                  value={formData.auth}
                  label="Método de autenticación"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="manual">Manual</MenuItem>
                  <MenuItem value="ldap">LDAP</MenuItem>
                  <MenuItem value="cas">CAS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mostrar email</InputLabel>
                <Select
                  name="maildisplay"
                  value={formData.maildisplay}
                  label="Mostrar email"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value={0}>Ocultar email a todos</MenuItem>
                  <MenuItem value={1}>Mostrar email a todos</MenuItem>
                  <MenuItem value={2}>Permitir que solo los contactos vean el email</MenuItem>
                </Select>
              </FormControl>
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
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCrearUsuarioMoodle;