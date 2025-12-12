import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Configuración del proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCUi4K240JjeqxbAGdXILaOaU0UNBUYyC0",
  authDomain: "pruebatecnica-2025.firebaseapp.com",
  projectId: "pruebatecnica-2025",
  storageBucket: "pruebatecnica-2025.firebasestorage.app",
  messagingSenderId: "869050518120",
  appId: "1:869050518120:web:935b781071ba882461c9dd",
  measurementId: "G-2H5DJG9P8Y"
};

// Inicializar la app
const app = initializeApp(firebaseConfig);

// REGION EXPLÍCITA PARA FUNCTIONS
const functions = getFunctions(app, "us-central1");

// Servicios
const db = getFirestore(app);
const storage = getStorage(app);

// Conexión a los emuladores
const host = window.location.hostname;
if (host === "localhost" || host === "127.0.0.1") {
  console.log("Conectando a emuladores...");

  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export { db, storage, functions };
