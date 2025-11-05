import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Login from './pages/Login';
import Panel from './pages/Panel';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{ padding: 50 }}>Cargando...</div>;

  return (
   <BrowserRouter>
  <Routes>
    {/* La raíz "/" es la página de login */}
    <Route 
      path="/" 
      element={user ? <Navigate to="/panel" replace /> : <Login />} 
    />
    
    {/* Ruta explícita /login (opcional, para compatibilidad) */}
    <Route 
      path="/login" 
      element={user ? <Navigate to="/panel" replace /> : <Login />} 
    />
    
    {/* Panel protegido */}
    <Route 
      path="/panel" 
      element={user ? <Panel /> : <Navigate to="/" replace />} 
    />
    
    {/* Cualquier otra ruta → redirige según estado */}
    <Route 
      path="*" 
      element={user ? <Navigate to="/panel" replace /> : <Navigate to="/" replace />} 
    />
  </Routes>
</BrowserRouter>
  );
}

export default App;
