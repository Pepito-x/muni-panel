import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      window.location.href = '/panel';
    } catch (e) {
      setError('Error al iniciar sesión: ' + e.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" align="center">Panel - Jefe de Informática</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Correo" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Contraseña" value={password} type="password" onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleLogin}>Ingresar</Button>
      </Box>
    </Container>
  );
}
