import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import generateCode from "../utils/generateCode";
import * as htmlToImage from "html-to-image";
import {
  Container,
  Box,
  Typography,
  Button,
  Input,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Modal,
} from "@mui/material";

export default function Panel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFile = (e) => setFile(e.target.files[0]);

  // 🟢 Importar CSV y generar códigos
  const parseCSV = () => {
    if (!file) {
      setMessage("⚠️ Sube un archivo CSV con columnas correo y rol.");
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const rows = results.data;
        let registrados = 0;

        for (const row of rows) {
          const correo = (row.correo || row.email || "").trim();
          const rol = (row.rol || "").trim().toLowerCase();
          if (!correo) continue;

          const codigo = generateCode(rol);

          // Verificar si ya existe
          const q = query(collection(db, "usuarios_pendientes"), where("correo", "==", correo));
          const snap = await getDocs(q);

          if (snap.empty) {
            await addDoc(collection(db, "usuarios_pendientes"), {
              correo,
              rol,
              codigo,
              registrado: false,
              creadoEn: new Date(),
            });
          } else {
            const docRef = snap.docs[0].ref;
            await updateDoc(docRef, { codigo, rol, registrado: false });
          }

          registrados++;
        }

        setMessage(`✅ Se registraron ${registrados} usuarios con sus códigos.`);
        loadUsers();
      },
    });
  };

  // 🟢 Cargar usuarios desde Firestore
  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "usuarios_pendientes"));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // 🟢 Generar imagen dentro de un modal
 const generarImagenCodigo = async (user) => {
  // Crear contenedor oculto temporal en el DOM
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px"; // fuera de pantalla
  document.body.appendChild(tempContainer);

  // Crear el contenido visual del código
  const node = document.createElement("div");
  node.style.padding = "20px";
  node.style.background = "#ffffff";
  node.style.width = "350px";
  node.style.textAlign = "center";
  node.style.border = "2px solid #1976d2";
  node.style.borderRadius = "12px";
  node.style.fontFamily = "Arial, sans-serif";
  node.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  node.innerHTML = `
    <img src="${window.location.origin}/src/assets/logo_reque.png"

         alt="Logo Municipalidad" 
         style="width:80px;margin-bottom:10px;" />
    <h2 style="color:#1976d2;margin-bottom:8px;">Municipalidad Distrital de Reque</h2>
    <p><strong>Correo:</strong> ${user.correo}</p>
    <p><strong>Rol:</strong> ${user.rol}</p>
    <h3 style="background:#1976d2;color:white;padding:10px;border-radius:8px;margin:10px 0;">
      ${user.codigo}
    </h3>
    <p style="font-size:12px;color:#555;margin-top:10px;">
      Código de acceso interno - ${new Date().getFullYear()}
    </p>
  `;

  tempContainer.appendChild(node);

  try {
    // Esperar un pequeño tiempo para que el navegador lo pinte
    await new Promise((r) => setTimeout(r, 200));

    // Generar imagen
    const dataUrl = await htmlToImage.toPng(node, { quality: 1 });
    setPreviewImg(dataUrl);
    setSelectedUser(user);
    setModalOpen(true);
  } catch (error) {
    console.error("Error generando imagen:", error);
    setMessage("❌ No se pudo generar la imagen.");
  } finally {
    // Eliminar el nodo temporal
    document.body.removeChild(tempContainer);
  }
};


  // 🟢 Descargar imagen desde modal
  const descargarImagen = () => {
    const link = document.createElement("a");
    link.download = `codigo_${selectedUser.correo}.png`;
    link.href = previewImg;
    link.click();
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Panel Jefe - Códigos de Autorización
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography sx={{ mb: 1 }}>📁 Subir CSV (columnas: correo, rol)</Typography>
        <Input type="file" onChange={handleFile} />
        <Button variant="contained" sx={{ ml: 2 }} onClick={parseCSV}>
          Generar códigos
        </Button>
        {message && <Alert sx={{ mt: 2 }}>{message}</Alert>}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Usuarios pendientes
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Registrado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell>{u.codigo}</TableCell>
                <TableCell>{u.registrado ? "✅ Sí" : "❌ No"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => generarImagenCodigo(u)}
                  >
                    Ver Imagen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* 🟢 Modal de vista previa */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Código de {selectedUser?.correo}
          </Typography>
          {previewImg && (
            <img
              src={previewImg}
              alt="Código generado"
              style={{ width: "100%", maxWidth: "350px", borderRadius: "8px" }}
            />
          )}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" onClick={descargarImagen}>
              Descargar
            </Button>
            <Button variant="outlined" color="error" onClick={() => setModalOpen(false)}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
