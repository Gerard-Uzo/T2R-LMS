import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgFEObhGb7pTqoNPc2PljcWrFN4vYm-qg",
    authDomain: "t2r-lms.firebaseapp.com",
    projectId: "t2r-lms",
    storageBucket: "t2r-lms.firebasestorage.app",
    messagingSenderId: "684814093970",
    appId: "1:684814093970:web:f6ec43e88106e74695604b",
    measurementId: "G-ZDJ1KEDGQ4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    app,
    auth,
    db,
    onAuthStateChanged
};