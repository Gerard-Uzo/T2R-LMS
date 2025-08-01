// admin-dashboard.js - Complete working solution with mobile fixes
function updateAdminNameUI() {
    const currentAdmin = JSON.parse(sessionStorage.getItem('adminUser'));
    if (!currentAdmin) return;
    const welcomeName = document.getElementById('welcomeAdminName');
    if (welcomeName) welcomeName.textContent = currentAdmin.name;
    const sidebarName = document.getElementById('sidebarAdminName');
    if (sidebarName) sidebarName.textContent = currentAdmin.name;
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    if (adminNameDisplay) adminNameDisplay.textContent = currentAdmin.name;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentAdmin = JSON.parse(sessionStorage.getItem('adminUser'));
    if (!currentAdmin) {
        window.location.href = 'admin-login.htm';
        return;
    }

    // Get stats based on admin role
    function getAdminStats() {
        const allCourses = JSON.parse(localStorage.getItem('courses')) || [];
        const allStudents = JSON.parse(localStorage.getItem('users')) || [];
        const allVideos = JSON.parse(localStorage.getItem('videos')) || [];
        const allMessages = JSON.parse(localStorage.getItem('messages')) || [];

        let adminCourses = allCourses;
        let adminStudents = allStudents;
        let adminVideos = allVideos;
        let adminMessages = allMessages;

        if (currentAdmin.role !== 'superadmin') {
            adminCourses = allCourses.filter(course =>
                course.admins.includes(currentAdmin.email)
            );

            adminStudents = allStudents.filter(student =>
                student.courses.some(courseId =>
                    adminCourses.some(c => c.id === courseId)
                )
            );

            adminVideos = allVideos.filter(video =>
                adminCourses.some(c => c.id === video.courseId)
            );

            adminMessages = allMessages.filter(message =>
                adminCourses.some(c => c.id === message.courseId)
            );
        }

        return {
            totalStudents: adminStudents.length,
            totalCourses: adminCourses.length,
            totalVideos: adminVideos.length,
            totalMessages: adminMessages.filter(m => !m.isRead).length
        };
    }

    // Get recent activity
    function getRecentActivity() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];

        let adminActivities = activities;
        if (currentAdmin.role !== 'superadmin') {
            const adminCourses = JSON.parse(localStorage.getItem('courses'))
                .filter(course => course.admins.includes(currentAdmin.email))
                .map(c => c.id);

            adminActivities = activities.filter(activity =>
                activity.courseId && adminCourses.includes(activity.courseId)
            );
        }

        return adminActivities.slice(0, 5);
    }

    // Update stats
    const stats = getAdminStats();
    document.getElementById('totalStudents').textContent = stats.totalStudents;
    document.getElementById('totalCourses').textContent = stats.totalCourses;
    document.getElementById('totalVideos').textContent = stats.totalVideos;
    document.getElementById('totalMessages').textContent = stats.totalMessages;

    // Populate recent activity
    const activityList = document.getElementById('recentActivity');
    const recentActivity = getRecentActivity();

    if (activityList) {
        activityList.innerHTML = '';

        if (recentActivity.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <p>No recent activity</p>
                </div>
            `;
        } else {
            recentActivity.forEach(activity => {
                const activityEl = document.createElement('div');
                activityEl.className = 'activity-item';

                let iconClass = 'fas fa-bell';
                if (activity.type === 'new_student') iconClass = 'fas fa-user-plus';
                else if (activity.type === 'course_completed') iconClass = 'fas fa-certificate';
                else if (activity.type === 'new_question') iconClass = 'fas fa-question-circle';
                else if (activity.type === 'video_uploaded') iconClass = 'fas fa-video';

                activityEl.innerHTML = `
                    <div class="activity-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.message}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                `;

                activityList.appendChild(activityEl);
            });
        }
    }

    // Update welcome message with admin name
    updateAdminNameUI();

    // Show/hide elements based on admin role
    if (currentAdmin.role !== 'superadmin') {
        const superadminOnlyElements = document.querySelectorAll('.superadmin-only');
        superadminOnlyElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    // Initialize admin mobile menu
    initAdminMobileMenu();

    // Setup admin logout
    setupAdminLogout();

    // Listen for storage changes (from settings page)
    window.addEventListener('storage', function(e) {
        if (e.key === 'adminUser') {
            updateAdminNameUI();
        }
    });
    // Also update on page focus (in case of same-tab update)
    window.addEventListener('focus', updateAdminNameUI);
});

// Move this outside the DOMContentLoaded event to make it globally available
function initAdminMobileMenu() {
    const mobileMenuBtn = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // Create overlay if it doesn't exist
    let sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
    }

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            sidebarOverlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });

        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Close sidebar when clicking on a link (for mobile)
        document.querySelectorAll('.sidebar-link, .toolbar-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            const sidebarOverlay = document.querySelector('.sidebar-overlay');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            if (sidebarOverlay) {
                sidebarOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
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