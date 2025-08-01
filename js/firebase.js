// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Authentication functions
async function registerUser(email, password, name) {
    try {
        // Check if email already exists in Firestore
        const usersRef = collection(db, "students");
        const q = query(usersRef, where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error("Email already exists");
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with display name
        await updateProfile(user, {
            displayName: name
        });

        // Create user document in Firestore
        await setDoc(doc(db, "students", user.uid), {
            email: email.toLowerCase(),
            name: name.trim(),
            createdAt: new Date().toISOString(),
            active: true,
            courses: [],
            lastLogin: null,
            profileComplete: false,
            phoneNumber: null,
            preferences: {
                language: 'en',
                dateFormat: 'MM/DD/YYYY',
                notifications: {
                    email: true,
                    sms: false
                }
            }
        });

        return { success: true, user };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            error: error.message === "Firebase: Error (auth/email-already-in-use)."
                ? "Email already exists"
                : error.message
        };
    }
}

async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "students", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Update last login
            await updateDoc(doc(db, "students", user.uid), {
                lastLogin: new Date().toISOString()
            });

            return { success: true, user: { ...userData, uid: user.uid } };
        }
        return { success: false, error: "User data not found" };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
    }
}

async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error: error.message };
    }
}

// Function to get current user data
async function getCurrentUserData() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const userDoc = await getDoc(doc(db, "students", user.uid));
        if (userDoc.exists()) {
            return { ...userDoc.data(), uid: user.uid };
        }
        return null;
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
}

// Auth state observer
function initAuthStateObserver() {
    onAuthStateChanged(auth, async (user) => {
        const authLinks = document.getElementById('authLinks');
        const userMenu = document.getElementById('userMenu');

        if (user) {
            // User is signed in
            const userData = await getCurrentUserData();
            if (userData) {
                if (authLinks) authLinks.style.display = 'none';
                if (userMenu) {
                    userMenu.style.display = 'block';
                    const usernameDisplay = document.getElementById('usernameDisplay');
                    if (usernameDisplay) {
                        usernameDisplay.textContent = userData.name || userData.email;
                    }
                }
            }
        } else {
            // User is signed out
            if (authLinks) authLinks.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';

            // Redirect if on protected page
            const protectedPages = ['dashboard.htm', 'profile.htm', 'settings.htm'];
            const currentPage = window.location.pathname.split('/').pop();
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'login.htm';
            }
        }
    });
}

// Auth state management
let currentAuthStateCallback = null;

function initAuthStateObserver(callback) {
    // Remove previous listener if exists
    if (currentAuthStateCallback) {
        currentAuthStateCallback();
    }

    // Set up new listener
    currentAuthStateCallback = onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userData = await getCurrentUserData();
                if (callback) callback(userData);

                // Update UI elements if they exist
                const authLinks = document.getElementById('authLinks');
                const userMenu = document.getElementById('userMenu');
                const usernameDisplay = document.getElementById('usernameDisplay');

                if (authLinks) authLinks.style.display = 'none';
                if (userMenu) {
                    userMenu.style.display = 'block';
                    if (usernameDisplay) {
                        usernameDisplay.textContent = userData?.name || user.email;
                    }
                }

                // Check if on auth page and redirect if necessary
                const authPages = ['login.htm', 'register.htm'];
                const currentPage = window.location.pathname.split('/').pop();
                if (authPages.includes(currentPage)) {
                    window.location.href = 'dashboard.htm';
                }
            } catch (error) {
                console.error("Error in auth state observer:", error);
            }
        } else {
            if (callback) callback(null);

            // Update UI elements
            const authLinks = document.getElementById('authLinks');
            const userMenu = document.getElementById('userMenu');

            if (authLinks) authLinks.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';

            // Check if on protected page and redirect if necessary
            const protectedPages = [
                'dashboard.htm',
                'profile.htm',
                'settings.htm',
                'courses.htm',
                'course-list.htm'
            ];
            const currentPage = window.location.pathname.split('/').pop();
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'login.htm';
            }
        }
    });
}

// Export all needed functions and objects
export {
    app,
    analytics,
    db,
    auth,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUserData,
    initAuthStateObserver,
    // Firestore exports
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    where,
    getDocs,
    // Auth exports
    onAuthStateChanged,
    updateProfile
};