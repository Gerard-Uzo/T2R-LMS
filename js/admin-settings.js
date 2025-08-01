// admin-settings.js - Admin Settings Management

document.addEventListener('DOMContentLoaded', function() {
    // Load admin data
    const currentAdmin = getCurrentAdmin();
    if (currentAdmin) {
        document.getElementById('currentAdminName').value = currentAdmin.name || 'Admin Name';
        document.getElementById('currentAdminEmail').value = currentAdmin.email || 'admin@trade2retire.com';
        document.getElementById('name').value = '';
        document.getElementById('phone').value = currentAdmin.phone || '';
        document.getElementById('adminNameDisplay').textContent = currentAdmin.name || 'Admin';
    }

    // Tab switching functionality
    const navButtons = document.querySelectorAll('.settings-nav-btn');
    const tabContents = document.querySelectorAll('.settings-tab');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                button.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                button.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });

    // Password strength meter
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', updatePasswordStrength);
    }

    function updatePasswordStrength() {
        const password = newPasswordInput.value;
        const meter = document.querySelector('.strength-meter');
        const text = document.querySelector('.strength-text');
        const strength = calculatePasswordStrength(password);
        let width = '0%';
        let color = '#ddd';
        let message = '';
        if (password.length === 0) {
            width = '0%';
            color = '#ddd';
            message = '';
        } else if (password.length < 8) {
            width = '25%';
            color = '#ff4444';
            message = 'Too weak';
        } else if (strength < 3) {
            width = '50%';
            color = '#ffbb33';
            message = 'Could be stronger';
        } else if (strength < 4) {
            width = '75%';
            color = '#00C851';
            message = 'Strong password';
        } else {
            width = '100%';
            color = '#007E33';
            message = 'Very strong password';
        }
        meter.style.width = width;
        meter.style.backgroundColor = color;
        text.textContent = message;
        text.style.color = color;
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[!@#$%^&*]+/)) strength++;
        return strength;
    }

    // Handle personal information form
    const personalForm = document.getElementById('adminPersonalForm');
    if (personalForm) {
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const timezone = document.getElementById('timezone').value;
            if (!name) {
                showAlert('Please enter your name', 'error');
                return;
            }
            if (!phone) {
                showAlert('Please enter your phone number', 'error');
                return;
            }
            // Update admin data in localStorage
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            const adminId = localStorage.getItem('currentAdminId');
            const adminIndex = admins.findIndex(admin => admin.id === adminId);
            if (adminIndex !== -1) {
                admins[adminIndex].name = name;
                admins[adminIndex].phone = phone;
                admins[adminIndex].timezone = timezone;
                admins[adminIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('admins', JSON.stringify(admins));
                // Also update sessionStorage for current session
                let sessionAdmin = JSON.parse(sessionStorage.getItem('adminUser'));
                if (sessionAdmin && sessionAdmin.id === adminId) {
                    sessionAdmin.name = name;
                    sessionAdmin.phone = phone;
                    sessionAdmin.timezone = timezone;
                    sessionStorage.setItem('adminUser', JSON.stringify(sessionAdmin));
                }
            }
            // Update UI fields
            document.getElementById('currentAdminName').value = name;
            document.getElementById('adminNameDisplay').textContent = name;
            // Update sidebar and dashboard name if present
            const adminNameElements = document.querySelectorAll('#adminNameDisplay, #sidebarAdminName, #welcomeAdminName');
            adminNameElements.forEach(el => { if (el) el.textContent = name; });
            showAlert('Personal information updated successfully!', 'success');
        });
    }

    // Handle password form
    const passwordForm = document.getElementById('adminPasswordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (!currentPassword || !newPassword || !confirmPassword) {
                showAlert('Please fill in all password fields', 'error');
                return;
            }
            if (newPassword !== confirmPassword) {
                showAlert('New passwords do not match', 'error');
                return;
            }
            if (newPassword.length < 8) {
                showAlert('New password must be at least 8 characters long', 'error');
                return;
            }
            if (calculatePasswordStrength(newPassword) < 3) {
                showAlert('Please choose a stronger password', 'error');
                return;
            }
            // Verify current password and update
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            const adminId = localStorage.getItem('currentAdminId');
            const adminIndex = admins.findIndex(admin => admin.id === adminId);
            if (adminIndex !== -1 && admins[adminIndex].password === currentPassword) {
                admins[adminIndex].password = newPassword;
                admins[adminIndex].passwordUpdatedAt = new Date().toISOString();
                localStorage.setItem('admins', JSON.stringify(admins));
                // Also update sessionStorage for current session
                let sessionAdmin = JSON.parse(sessionStorage.getItem('adminUser'));
                if (sessionAdmin && sessionAdmin.id === adminId) {
                    sessionAdmin.password = newPassword;
                    sessionStorage.setItem('adminUser', JSON.stringify(sessionAdmin));
                }
                showAlert('Password updated successfully!', 'success');
                passwordForm.reset();
            } else {
                showAlert('Current password is incorrect', 'error');
            }
        });
    }

    // Handle notification preferences
    const notificationToggles = document.querySelectorAll('input[type="checkbox"]');
    notificationToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.id;
            const enabled = this.checked;
            updateAdminPreference(setting, enabled);
            showAlert(`${setting} setting updated`, 'success');
        });
    });

    // Helper functions
    function getCurrentAdmin() {
        const admins = JSON.parse(localStorage.getItem('admins')) || [];
        const adminId = localStorage.getItem('currentAdminId');
        return admins.find(admin => admin.id === adminId);
    }
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        const form = document.querySelector('.settings-tab.active form');
        if (form) {
            form.parentNode.insertBefore(alertDiv, form);
            setTimeout(() => alertDiv.remove(), 3000);
        }
    }
    function updateAdminPreference(setting, enabled) {
        const admin = getCurrentAdmin();
        if (admin) {
            admin.preferences = admin.preferences || {};
            admin.preferences[setting] = enabled;
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            const adminId = localStorage.getItem('currentAdminId');
            const adminIndex = admins.findIndex(a => a.id === adminId);
            if (adminIndex !== -1) {
                admins[adminIndex].preferences = admin.preferences;
                localStorage.setItem('admins', JSON.stringify(admins));
            }
            // Also update sessionStorage for current session
            let sessionAdmin = JSON.parse(sessionStorage.getItem('adminUser'));
            if (sessionAdmin && sessionAdmin.id === adminId) {
                sessionAdmin.preferences = admin.preferences;
                sessionStorage.setItem('adminUser', JSON.stringify(sessionAdmin));
            }
        }
    }
    // Load saved preferences
    function loadSavedPreferences() {
        const admin = getCurrentAdmin();
        if (admin && admin.preferences) {
            Object.entries(admin.preferences).forEach(([setting, enabled]) => {
                const toggle = document.getElementById(setting);
                if (toggle) toggle.checked = enabled;
            });
        }
        // Load language and date format preferences
        const language = localStorage.getItem('adminLanguage') || 'en';
        const dateFormat = localStorage.getItem('dateFormat') || 'MM/DD/YYYY';
        document.getElementById('adminLanguage').value = language;
        document.getElementById('dateFormat').value = dateFormat;
    }
    loadSavedPreferences();
});
