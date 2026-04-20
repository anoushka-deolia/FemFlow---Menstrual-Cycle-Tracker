import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD56pd8sDg-nIwzJOCu2wm4CBL2dgVFjNk",
  authDomain: "luna-ai-e284e.firebaseapp.com",
  projectId: "luna-ai-e284e",
  storageBucket: "luna-ai-e284e.firebasestorage.app",
  messagingSenderId: "1032368866758",
  appId: "1:1032368866798:web:e49cfcd9fae5918dc25ec7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── Auth ────────────────────────────────────────────────
export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback);

// ─── Cycle Logs ──────────────────────────────────────────
export const addLog = async (userId, logData) => {
  const ref = collection(db, "users", userId, "logs");
  return addDoc(ref, {
    ...logData,
    createdAt: Timestamp.now(),
  });
};

export const updateLog = async (userId, logId, data) => {
  const ref = doc(db, "users", userId, "logs", logId);
  return updateDoc(ref, data);
};

export const deleteLog = async (userId, logId) => {
  const ref = doc(db, "users", userId, "logs", logId);
  return deleteDoc(ref);
};

export const getLogs = async (userId) => {
  const ref = collection(db, "users", userId, "logs");
  const q = query(ref, orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── User Profile ────────────────────────────────────────
export const saveProfile = async (userId, data) => {
  const ref = doc(db, "users", userId, "profile", "info");
  return setDoc(ref, data, { merge: true });
};

export const getProfile = async (userId) => {
  const ref = doc(db, "users", userId, "profile", "info");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};