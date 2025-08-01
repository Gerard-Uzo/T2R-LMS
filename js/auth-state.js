import { auth, onAuthStateChanged } from './firebase-config.js';

const protectedRoutes = ['dashboard.htm', 'profile.htm', 'settings.htm'];
const authRoutes = ['login.htm', 'register.htm'];

onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split('/').pop();

    // Update UI elements
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');

    if (user) {
        // User is signed in
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                // Use displayName if available, otherwise fall back to email
                usernameDisplay.textContent = user.displayName || user.email;
            }
        }

        // Update welcome message on dashboard
        if (currentPage === 'dashboard.htm') {
            const welcomeUsername = document.getElementById('welcomeUsername');
            if (welcomeUsername) {
                welcomeUsername.textContent = user.displayName || user.email;
            }
        }

        // Redirect logged-in users away from auth pages
        if (authRoutes.includes(currentPage)) {
            window.location.href = "dashboard.htm";
        }
    } else {
        // User is signed out
        if (authLinks) authLinks.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';

        // Redirect logged-out users from protected pages
        if (protectedRoutes.includes(currentPage)) {
            window.location.href = "login.htm";
        }
    }
});