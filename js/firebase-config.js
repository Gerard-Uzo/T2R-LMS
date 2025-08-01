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

// Your EXACT Firebase configuration
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

// Database operations (identical to your current structure)
async function createUserDocument(user, additionalData) {
    await setDoc(doc(db, "students", user.uid), {
        email: user.email,
        name: user.displayName || additionalData.name,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        active: true,
        courses: [],
        ...additionalData
    });
}

async function updateUserDocument(uid, data) {
    await updateDoc(doc(db, "students", uid), data);
}

// Auth functions with database integration
async function registerUser(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });
        await createUserDocument(user, { name });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message.includes("email-already-in-use")
                   ? "Email already registered"
                   : "Registration failed"
        };
    }
}

async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await updateUserDocument(userCredential.user.uid, {
            lastLogin: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.code === "auth/wrong-password"
                   ? "Incorrect password"
                   : "Login failed"
        };
    }
}

export {
    app,
    auth,
    db,
    registerUser,
    loginUser,
    signOut as logoutUser,
    onAuthStateChanged
};