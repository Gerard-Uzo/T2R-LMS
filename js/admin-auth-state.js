document.addEventListener('DOMContentLoaded', function() {
    const adminUser = JSON.parse(sessionStorage.getItem('adminUser'));
    const adminMenu = document.getElementById('adminMenu');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    function updateAdminUI() {
        if (adminUser) {
            if (adminMenu) {
                adminMenu.style.display = 'block';
                const adminNameElements = document.querySelectorAll('#adminNameDisplay, #sidebarAdminName, #welcomeAdminName');
                adminNameElements.forEach(el => {
                    if (el) el.textContent = adminUser.name || 'Admin';
                });

                const adminAvatarElements = document.querySelectorAll('.admin-avatar, #adminAvatar');
                adminAvatarElements.forEach(el => {
                    if (el) el.src = adminUser.avatar || 'assets/default-avatar.jpg';
                });
            }
        } else {
            if (adminMenu) adminMenu.style.display = 'none';
        }
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('adminUser');
            window.location.href = 'admin-login.htm';
        });
    }

    // Protect admin routes
    const adminRoutes = ['admin-dashboard.htm', 'admin-courses.htm', 'admin-videos.htm',
                        'admin-students.htm', 'admin-messages.htm', 'admin-settings.htm'];
    const isAdminRoute = adminRoutes.some(route => window.location.pathname.endsWith(route));

    if (isAdminRoute && !adminUser) {
        window.location.href = 'admin-login.htm?redirect=' + encodeURIComponent(window.location.pathname);
    }

    // Prevent access to admin login when already logged in
    if (window.location.pathname.endsWith('admin-login.htm') && adminUser) {
        window.location.href = 'admin-dashboard.htm';
    }

    updateAdminUI();
});
// admin-auth-state.js - Admin authentication state management
document.addEventListener('DOMContentLoaded', function() {
    // Check admin auth state on load
    checkAdminAuthState();

    // Setup admin logout
    setupAdminLogout();

    // Initialize mobile menu for admin
    initAdminMobileMenu();
});

function checkAdminAuthState() {
    const currentAdmin = JSON.parse(sessionStorage.getItem('adminUser'));
    const currentPage = window.location.pathname.split('/').pop();
    const adminPages = ['admin-dashboard.htm', 'admin-courses.htm', 'admin-videos.htm', 'admin-tests.htm'];

    // Redirect to admin login if trying to access admin page without auth
    if (adminPages.includes(currentPage) && !currentAdmin) {
        window.location.href = 'admin-login.htm';
        return;
    }

    // Update admin name display
    const adminNameElements = document.querySelectorAll('#adminNameDisplay, #sidebarAdminName');
    adminNameElements.forEach(el => {
        if (el && currentAdmin) {
            el.textContent = currentAdmin.name;
        }
    });
}

function setupAdminLogout() {
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('adminUser');
                window.location.href = 'admin-login.htm';
            }
        });
    }
}

function initAdminMobileMenu() {
    const mobileMenuBtn = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';

    if (mobileMenuBtn && sidebar) {
        document.body.appendChild(sidebarOverlay);

        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking on a link (for mobile)
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}