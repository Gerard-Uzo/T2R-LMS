import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);
const db = getFirestore(app);

export async function registerStudent(email, password, name) {
    try {
        // 1. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Update user profile with display name (this is crucial)
        await updateProfile(user, {
            displayName: name.trim()
        });

        // 3. Create user document in Firestore
        await setDoc(doc(db, "students", user.uid), {
            uid: user.uid,
            email: email.toLowerCase(),
            name: name.trim(),
            createdAt: new Date().toISOString(),
            active: true,
            courses: [],
            lastLogin: new Date().toISOString(),
            profileComplete: false
        });

        // 4. Automatically log the user in
        await signInWithEmailAndPassword(auth, email, password);

        return true;
    } catch (error) {
        console.error("Registration error:", error);

        // Convert Firebase errors to user-friendly messages
        let message = "Registration failed. Please try again.";

        if (error.code === 'auth/email-already-in-use') {
            message = "This email is already registered.";
        } else if (error.code === 'auth/weak-password') {
            message = "Password should be at least 6 characters.";
        } else if (error.code === 'auth/invalid-email') {
            message = "Please enter a valid email address.";
        }

        throw new Error(message);
    }
}

export async function logoutUser() {
    try {
        await auth.signOut();
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}