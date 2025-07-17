import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCv_r8ApAfNylfhtKPuSYVBN8yWySHwrJU",
    authDomain: "taskmanagerapp-901de.firebaseapp.com",
    projectId: "taskmanagerapp-901de",
    storageBucket: "taskmanagerapp-901de.appspot.com",
    messagingSenderId: "895437455138",
    appId: "1:895437455138:web:1f760ab7c46d68d74a2f7b",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
