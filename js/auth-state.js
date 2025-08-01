import { auth, onAuthStateChanged } from './firebase-config.js';

const protectedRoutes = ['dashboard.htm', 'profile.htm', 'settings.htm'];
const authRoutes = ['login.htm', 'register.htm'];

onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split('/').pop();

    // Redirect logged-in users away from auth pages
    if (user && authRoutes.includes(currentPage)) {
        window.location.href = "dashboard.htm";
    }
    // Redirect logged-out users from protected pages
    else if (!user && protectedRoutes.includes(currentPage)) {
        window.location.href = "login.htm";
    }
});