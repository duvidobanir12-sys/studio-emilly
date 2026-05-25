// auth.js – módulo de autenticação Firebase (email/senha)
// Esta configuração é idêntica à encontrada em index.html
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyALLJn7hEnTxvTN2SNVzkAEs1HAwUG24hE",
  authDomain: "studio-emilly.firebaseapp.com",
  databaseURL: "https://studio-emilly-default-rtdb.firebaseio.com",
  projectId: "studio-emilly",
  storageBucket: "studio-emilly.appspot.com",
  messagingSenderId: "130072077830",
  appId: "1:130072077830:web:694aa5bb37307dae260587"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

export const observeAuth = (callback) =>
  onAuthStateChanged(auth, (user) => callback(user));
