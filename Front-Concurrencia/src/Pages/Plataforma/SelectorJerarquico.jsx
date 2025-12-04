// src/components/Plataforma/SelectorJerarquico.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Grid,
  Alert,
  Typography,
  Card,
  CardContent
} from '@mui/material';
    import plataformaService from '../../Services/plataforma.service';

const SelectorJerarquico = ({ onGrupoSeleccionado, initialGrupoId = null }) => {
  const [programas, setProgramas] = useState([]);
  const [cuatrimestres, setCuatrimestres] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState('');
  
  const [loading, setLoading] = useState({
    programas: false,
    cuatrimestres: false,
    materias: false,
    grupos: false
  });
  
  const [error, setError] = useState(null);

  // Cargar programas al inicio
  useEffect(() => {
    cargarProgramas();
  }, []);

  // Cargar programa específico si hay initialGrupoId
  useEffect(() => {
    if (initialGrupoId) {
      cargarGrupoInicial(initialGrupoId);
    }
  }, [initialGrupoId]);

  const cargarProgramas = async () => {
    try {
      setLoading(prev => ({ ...prev, programas: true }));
      setError(null);
      
      const response = await plataformaService.getProgramas();
      
      if (response.success) {
        setProgramas(response.data || []);
      } else {
        setError('Error al cargar programas');
      }
    } catch (error) {
      console.error('Error cargando programas:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(prev => ({ ...prev, programas: false }));
    }
  };

  const cargarCuatrimestres = async (programaId) => {
    if (!programaId) {
      setCuatrimestres([]);
      setMaterias([]);
      setGrupos([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, cuatrimestres: true }));
      setError(null);
      
      const response = await plataformaService.getCuatrimestres(programaId);
      
      if (response.success) {
        setCuatrimestres(response.data || []);
        // Resetear selecciones posteriores
        setSelectedCuatrimestre('');
        setSelectedMateria('');
        setSelectedGrupo('');
        setMaterias([]);
        setGrupos([]);
      } else {
        setError('Error al cargar cuatrimestres');
      }
    } catch (error) {
      console.error('Error cargando cuatrimestres:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(prev => ({ ...prev, cuatrimestres: false }));
    }
  };

  const cargarMaterias = async (cuatrimestreId) => {
    if (!cuatrimestreId) {
      setMaterias([]);
      setGrupos([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, materias: true }));
      setError(null);
      
      const response = await plataformaService.getMaterias(cuatrimestreId);
      
      if (response.success) {
        setMaterias(response.data || []);
        // Resetear selecciones posteriores
        setSelectedMateria('');
        setSelectedGrupo('');
        setGrupos([]);
      } else {
        setError('Error al cargar materias');
      }
    } catch (error) {
      console.error('Error cargando materias:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(prev => ({ ...prev, materias: false }));
    }
  };

  const cargarGrupos = async (materiaId) => {
    if (!materiaId) {
      setGrupos([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, grupos: true }));
      setError(null);
      
      const response = await plataformaService.getGrupos(materiaId);
      
      if (response.success) {
        setGrupos(response.data || []);
        // Resetear selección de grupo
        setSelectedGrupo('');
      } else {
        setError('Error al cargar grupos');
      }
    } catch (error) {
      console.error('Error cargando grupos:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(prev => ({ ...prev, grupos: false }));
    }
  };

  const cargarGrupoInicial = async (grupoId) => {
    try {
      setLoading({
        programas: true,
        cuatrimestres: true,
        materias: true,
        grupos: true
      });
      
      const response = await plataformaService.getGrupoInfo(grupoId);
      
      if (response.success) {
        const grupo = response.data;
        
        // Cargar programas primero
        const programasRes = await plataformaService.getProgramas();
        setProgramas(programasRes.data || []);
        
        // Buscar y seleccionar el programa
        const programa = programasRes.data?.find(p => 
          p.nombre === grupo.programa_nombre
        );
        
        if (programa) {
          setSelectedPrograma(programa.id);
          
          // Cargar cuatrimestres del programa
          const cuatrimestresRes = await plataformaService.getCuatrimestres(programa.id);
          setCuatrimestres(cuatrimestresRes.data || []);
          
          // Buscar y seleccionar el cuatrimestre
          const cuatrimestre = cuatrimestresRes.data?.find(c => 
            c.numero === grupo.cuatrimestre_numero
          );
          
          if (cuatrimestre) {
            setSelectedCuatrimestre(cuatrimestre.id);
            
            // Cargar materias del cuatrimestre
            const materiasRes = await plataformaService.getMaterias(cuatrimestre.id);
            setMaterias(materiasRes.data || []);
            
            // Buscar y seleccionar la materia
            const materia = materiasRes.data?.find(m => 
              m.id === grupo.materia_id
            );
            
            if (materia) {
              setSelectedMateria(materia.id);
              
              // Cargar grupos de la materia
              const gruposRes = await plataformaService.getGrupos(materia.id);
              setGrupos(gruposRes.data || []);
              
              // Seleccionar el grupo
              setSelectedGrupo(grupo.id);
              
              // Notificar al componente padre
              if (onGrupoSeleccionado) {
                onGrupoSeleccionado(grupo);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error cargando grupo inicial:', error);
      setError('Error al cargar la información del grupo');
    } finally {
      setLoading({
        programas: false,
        cuatrimestres: false,
        materias: false,
        grupos: false
      });
    }
  };

  const handleProgramaChange = (event) => {
    const programaId = event.target.value;
    setSelectedPrograma(programaId);
    cargarCuatrimestres(programaId);
  };

  const handleCuatrimestreChange = (event) => {
    const cuatrimestreId = event.target.value;
    setSelectedCuatrimestre(cuatrimestreId);
    cargarMaterias(cuatrimestreId);
  };

  const handleMateriaChange = (event) => {
    const materiaId = event.target.value;
    setSelectedMateria(materiaId);
    cargarGrupos(materiaId);
  };

  const handleGrupoChange = async (event) => {
    const grupoId = event.target.value;
    setSelectedGrupo(grupoId);
    
    if (grupoId && onGrupoSeleccionado) {
      try {
        const response = await plataformaService.getGrupoInfo(grupoId);
        if (response.success) {
          onGrupoSeleccionado(response.data);
        }
      } catch (error) {
        console.error('Error cargando información del grupo:', error);
        setError('Error al cargar información del grupo');
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Seleccionar Grupo
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          {/* Programa */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="programa-label">
                {loading.programas ? 'Cargando...' : 'Programa'}
              </InputLabel>
              <Select
                labelId="programa-label"
                value={selectedPrograma}
                label={loading.programas ? 'Cargando...' : 'Programa'}
                onChange={handleProgramaChange}
                disabled={loading.programas}
              >
                <MenuItem value="">
                  <em>Seleccionar programa</em>
                </MenuItem>
                {programas.map((programa) => (
                  <MenuItem key={programa.id} value={programa.id}>
                    {programa.nombre}
                  </MenuItem>
                ))}
              </Select>
              {loading.programas && (
                <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: '50%' }} />
              )}
            </FormControl>
          </Grid>
          
          {/* Cuatrimestre */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth disabled={!selectedPrograma || loading.cuatrimestres}>
              <InputLabel id="cuatrimestre-label">
                {loading.cuatrimestres ? 'Cargando...' : 'Cuatrimestre'}
              </InputLabel>
              <Select
                labelId="cuatrimestre-label"
                value={selectedCuatrimestre}
                label={loading.cuatrimestres ? 'Cargando...' : 'Cuatrimestre'}
                onChange={handleCuatrimestreChange}
              >
                <MenuItem value="">
                  <em>Seleccionar cuatrimestre</em>
                </MenuItem>
                {cuatrimestres.map((cuatrimestre) => (
                  <MenuItem key={cuatrimestre.id} value={cuatrimestre.id}>
                    {cuatrimestre.nombre}
                  </MenuItem>
                ))}
              </Select>
              {loading.cuatrimestres && (
                <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: '50%' }} />
              )}
            </FormControl>
          </Grid>
          
          {/* Materia */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth disabled={!selectedCuatrimestre || loading.materias}>
              <InputLabel id="materia-label">
                {loading.materias ? 'Cargando...' : 'Materia'}
              </InputLabel>
              <Select
                labelId="materia-label"
                value={selectedMateria}
                label={loading.materias ? 'Cargando...' : 'Materia'}
                onChange={handleMateriaChange}
              >
                <MenuItem value="">
                  <em>Seleccionar materia</em>
                </MenuItem>
                {materias.map((materia) => (
                  <MenuItem key={materia.id} value={materia.id}>
                    {materia.nombre} ({materia.codigo})
                  </MenuItem>
                ))}
              </Select>
              {loading.materias && (
                <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: '50%' }} />
              )}
            </FormControl>
          </Grid>
          
          {/* Grupo */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth disabled={!selectedMateria || loading.grupos}>
              <InputLabel id="grupo-label">
                {loading.grupos ? 'Cargando...' : 'Grupo'}
              </InputLabel>
              <Select
                labelId="grupo-label"
                value={selectedGrupo}
                label={loading.grupos ? 'Cargando...' : 'Grupo'}
                onChange={handleGrupoChange}
              >
                <MenuItem value="">
                  <em>Seleccionar grupo</em>
                </MenuItem>
                {grupos.map((grupo) => (
                  <MenuItem key={grupo.id} value={grupo.id}>
                    {grupo.nombre} ({grupo.total_alumnos || 0} alumnos)
                    {grupo.curso_moodle_id && ' ✓'}
                  </MenuItem>
                ))}
              </Select>
              {loading.grupos && (
                <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: '50%' }} />
              )}
            </FormControl>
          </Grid>
        </Grid>
        
        {selectedGrupo && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="body2" color="white">
              Grupo seleccionado: {grupos.find(g => g.id === selectedGrupo)?.nombre}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectorJerarquico;