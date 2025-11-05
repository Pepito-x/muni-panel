// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDN6ffRjygYRkvTYojMc76MF2RRn1-NY0Q",
  authDomain: "muni-5ec79.firebaseapp.com",
  projectId: "muni-5ec79",
  storageBucket: "muni-5ec79.firebasestorage.app",
  messagingSenderId: "290097347317",
  appId: "1:290097347317:web:8f5132843583865e2d63bc"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios para usar en toda la app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
