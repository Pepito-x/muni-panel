import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

// Reemplaza esto con tu logo real de la municipalidad (debe estar en /public)
import logoMuni from '/logo_muni.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      window.location.href = '/panel';
    } catch (e) {
      setError('Credenciales incorrectas o cuenta no autorizada.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa', // gris muy claro
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={isMobile ? 0 : 6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'white',
            boxShadow: isMobile ? 'none' : undefined,
            border: isMobile ? '1px solid #e0e0e0' : 'none',
          }}
        >
          {/* Logo y título */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src={logoMuni}
              alt="Municipalidad Distrital de Reque"
              sx={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                mb: 2,
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                p: 1,
              }}
            />
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              fontWeight="bold"
              color="#1976d2" // Azul institucional
              gutterBottom
            >
              Municipalidad Distrital de Reque
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: 500 }}
            >
              Panel de Gestión - Jefe de Informática
            </Typography>
          </Box>

          {/* Mensaje de error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Correo institucional"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                sx: {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                sx: {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
              startIcon={<LockIcon />}
            >
              {loading ? 'Ingresando...' : 'Acceder al Sistema'}
            </Button>
          </Box>

          {/* Pie informativo */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Sistema Interno • Acceso restringido a personal autorizado
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}