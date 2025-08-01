document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomeUsername = document.getElementById('welcomeUsername');
    const sidebarUsername = document.getElementById('sidebarUsername');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const userAvatar = document.querySelector('.user-avatar');
    const upcomingTestsList = document.getElementById('upcomingTestsList');
    const recentResultsList = document.getElementById('recentResultsList');
    const logoutBtn = document.getElementById('logoutBtn');

    // State
    const currentUserId = 'user-123'; // In real app, use actual user ID

    // Initialize
    init();

    function init() {
        // Load user data
        const user = getUserData();
        if (user) {
            welcomeUsername.textContent = user.name;
            sidebarUsername.textContent = user.name;
            usernameDisplay.textContent = user.name;
            if (user.avatar) {
                sidebarAvatar.src = user.avatar;
                userAvatar.src = user.avatar;
            }
        }

        // Set up logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Render test preview
        renderTestPreview();
    }

    function handleLogout(e) {
        e.preventDefault();
        logoutUser();
    }

    function logoutUser() {
        // Clear user session data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');

        // Redirect to login page
        window.location.href = 'login.html'; // Change to your actual login page
    }

    function getUserData() {
        // In a real app, this would come from your authentication system
        return {
            id: currentUserId,
            name: 'John Doe',
            avatar: 'assets/default-avatar.jpg'
        };
    }

    function renderTestPreview() {
        const upcomingTests = getTests().filter(test =>
            test.status === 'active' &&
            !getSubmissions().some(s => s.testId === test.id && s.userId === currentUserId)
        ).slice(0, 3);

        const recentResults = getSubmissions()
            .filter(s => s.userId === currentUserId)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        // Render upcoming tests
        if (upcomingTests.length > 0) {
            upcomingTests.forEach(test => {
                const course = getCourse(test.courseId);
                const item = document.createElement('div');
                item.className = 'test-preview-item';
                item.innerHTML = `
                    <strong>${test.title}</strong>
                    <p>Course: ${course?.title || 'Unknown'}</p>
                `;
                upcomingTestsList.appendChild(item);
            });
        } else {
            upcomingTestsList.innerHTML = '<p>No upcoming tests</p>';
        }

        // Render recent results
        if (recentResults.length > 0) {
            recentResults.forEach(sub => {
                const test = getTest(sub.testId);
                if (!test) return;

                const item = document.createElement('div');
                item.className = 'test-preview-item';
                item.innerHTML = `
                    <strong>${test.title}</strong>
                    <p>Score: <span class="${sub.passed ? 'passed' : 'failed'}">${sub.score}%</span></p>
                `;
                recentResultsList.appendChild(item);
            });
        } else {
            recentResultsList.innerHTML = '<p>No test results yet</p>';
        }
    }

    // Data functions
    function getTests() {
        return JSON.parse(localStorage.getItem('tests')) || [];
    }

    function getTest(id) {
        return getTests().find(t => t.id === id);
    }

    function getSubmissions() {
        return JSON.parse(localStorage.getItem('testSubmissions')) || [];
    }

    function getCourse(id) {
        const courses = [
            { id: '1', title: 'CRT Masterclass', category: 'CRT' },
            { id: '2', title: 'Psychology of Trading', category: 'Psychology' }
        ];
        return courses.find(c => c.id === id);
    }
});
// Initialize mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle for main navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle for admin sidebar
    const adminMenuToggle = document.querySelector('.menu-toggle');
    const adminSidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';

    if (adminMenuToggle && adminSidebar) {
        document.body.appendChild(sidebarOverlay);

        adminMenuToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', function() {
            adminSidebar.classList.remove('active');
        });
    }

    // Close admin sidebar when clicking on a link
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                adminSidebar.classList.remove('active');
            }
        });
    });

    // Add back button to pages that need it
    const pagesWithoutBack = ['certificates.htm', 'course-list.htm', 'settings.htm', 'progress.htm', 'student-tests.htm'];
    const currentPage = window.location.pathname.split('/').pop();

    if (pagesWithoutBack.includes(currentPage)) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            const backButton = document.createElement('a');
            backButton.href = 'dashboard.htm';
            backButton.className = 'back-button';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Dashboard';
            mainContent.insertBefore(backButton, mainContent.firstChild);
        }
    }
});