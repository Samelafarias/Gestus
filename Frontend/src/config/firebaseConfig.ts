import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Se for usar banco de dados

const firebaseConfig = {
  apiKey: "AIzaSyANRCUXIAliNrI3JWXYzMpsHmPYndIdZzE",
  authDomain: "gestus-905ae.firebaseapp.com",
  projectId: "gestus-905ae",
  storageBucket: "gestus-905ae.firebasestorage.app",
  messagingSenderId: "742655620870",
  appId: "1:742655620870:web:d5a170bc6bf4e9d37fd087",
  measurementId: "G-RQ6PGLNE9G"
};

// Inicializa o Firebase (evita inicializar duplicado se o Metro der reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exporta as instâncias para usar no Login.tsx e em outros lugares
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;