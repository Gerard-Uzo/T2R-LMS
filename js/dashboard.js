// dashboard.js - Complete working solution with enhanced logout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();

    // Setup logout functionality
    setupDashboardLogout();
});

function initDashboard() {
    // DOM Elements
    const welcomeUsername = document.getElementById('welcomeUsername');
    const sidebarUsername = document.getElementById('sidebarUsername');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const userAvatar = document.querySelector('.user-avatar');

    // Load user data
    const user = getCurrentUser();
    if (user) {
        welcomeUsername.textContent = user.name;
        sidebarUsername.textContent = user.name;
        usernameDisplay.textContent = user.name;
        if (user.avatar) {
            sidebarAvatar.src = user.avatar;
            userAvatar.src = user.avatar;
        }
    }

    // Render test preview
    renderTestPreview();
}

function setupDashboardLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Make logout function globally available
window.logout = function() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userToken');
    window.location.href = 'index.html';
};

function renderTestPreview() {
    const upcomingTestsList = document.getElementById('upcomingTestsList');
    const recentResultsList = document.getElementById('recentResultsList');
    const currentUserId = 'user-123'; // In real app, use actual user ID

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

// Reuse auth functions
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}
// ALL YOUR EXISTING JAVASCRIPT CODE REMAINS THE SAME
// ...

// ===== ONLY ADD THESE 10 LINES AT THE BOTTOM =====
// Enhanced logout function
function handleLogout(e) {
    if (e) e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userToken');
        window.location.href = 'index.html';
    }
}

// Setup logout button
document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

// Make available globally
window.logout = handleLogout;