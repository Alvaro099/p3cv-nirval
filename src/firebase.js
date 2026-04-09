import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ──────────────────────────────────────────────────────────────
// 🔴 COMPLETAR con las credenciales de tu proyecto Firebase:
//    https://console.firebase.google.com → Tu proyecto → Configuración del proyecto
// ──────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyD5eu10O6wz8GmxlwZfrn993vrCzOKgPls",
  authDomain: "chat-cvp3.firebaseapp.com",
  projectId: "chat-cvp3",
  storageBucket: "chat-cvp3.firebasestorage.app",
  messagingSenderId: "42248950220",
  appId: "1:42248950220:web:559987dff93610d01e8d69"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
