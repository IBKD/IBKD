import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, Timestamp, updateDoc, doc, deleteDoc, where, getCountFromServer } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// ------------------------------------------------------------------
// KONFIGURATION
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCRzKjn2BMiP35xffeGtb3tbMRdjeg2Du8",
  authDomain: "initiative-berufskraftfahrer.firebaseapp.com",
  projectId: "initiative-berufskraftfahrer",
  storageBucket: "initiative-berufskraftfahrer.firebasestorage.app",
  messagingSenderId: "44857091742",
  appId: "1:44857091742:web:76ea520849ba73bf04bd8f",
  measurementId: "G-JR7VSSQGF9"
};

let db: any = null;
let auth: any = null;

if (firebaseConfig.projectId) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase & Auth erfolgreich initialisiert.");
  } catch (error) {
    console.error("Fehler bei der Firebase Initialisierung:", error);
  }
}

// Manuelle Definition des User-Interfaces, um Import-Fehler zu vermeiden
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

// Export Values (JavaScript runtime objects)
export { 
  db, auth, 
  collection, addDoc, getDocs, orderBy, query, Timestamp, 
  updateDoc, doc, deleteDoc, where, getCountFromServer,
  signInWithEmailAndPassword, signOut, onAuthStateChanged 
};