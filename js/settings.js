// settings.js - User Account Settings

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Load user data
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('currentName').value = currentUser.name || '';
        document.getElementById('newName').value = '';
        document.getElementById('currentPhone').value = currentUser.phone || '';
        document.getElementById('newPhone').value = '';
        // Preferences
        document.getElementById('userLanguage').value = localStorage.getItem('userLanguage') || 'en';
        document.getElementById('dateFormat').value = localStorage.getItem('dateFormat') || 'MM/DD/YYYY';
        document.getElementById('emailNotifications').checked = localStorage.getItem('emailNotifications') === 'true';
        document.getElementById('smsNotifications').checked = localStorage.getItem('smsNotifications') === 'true';
    }

    // Account form
    const accountForm = document.getElementById('userAccountForm');
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('newName').value.trim();
        const newPhone = document.getElementById('newPhone').value.trim();
        if (!newName && !newPhone) {
            showAlert('Please enter a new name or phone number.', 'error');
            return;
        }
        let updated = false;
        let students = JSON.parse(localStorage.getItem('students')) || [];
        let user = getCurrentUser();
        const idx = students.findIndex(s => s.id === user.id);
        if (idx !== -1) {
            if (newName) {
                students[idx].name = newName;
                user.name = newName;
                updated = true;
            }
            if (newPhone) {
                students[idx].phone = newPhone;
                user.phone = newPhone;
                updated = true;
            }
            if (updated) {
                localStorage.setItem('students', JSON.stringify(students));
                localStorage.setItem('currentUser', JSON.stringify(user));
                document.getElementById('currentName').value = user.name || '';
                document.getElementById('currentPhone').value = user.phone || '';
                document.getElementById('newName').value = '';
                document.getElementById('newPhone').value = '';
                showAlert('Account information updated!', 'success');
            }
        }
    });

    // Password form
    const passwordForm = document.getElementById('userPasswordForm');
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentPassword = this.elements.currentPassword.value;
        const newPassword = this.elements.newPassword.value;
        const confirmPassword = this.elements.confirmPassword.value;
        let students = JSON.parse(localStorage.getItem('students')) || [];
        let user = getCurrentUser();
        const idx = students.findIndex(s => s.id === user.id);
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert('Please fill in all password fields.', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showAlert("New passwords don't match!", 'error');
            return;
        }
        if (newPassword.length < 8) {
            showAlert('Password must be at least 8 characters long!', 'error');
            return;
        }
        if (idx !== -1 && students[idx].password === currentPassword) {
            students[idx].password = newPassword;
            localStorage.setItem('students', JSON.stringify(students));
            showAlert('Password changed successfully!', 'success');
            this.reset();
        } else {
            showAlert('Current password is incorrect.', 'error');
        }
    });

    // Preferences form
    const preferencesForm = document.getElementById('userPreferencesForm');
    preferencesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        localStorage.setItem('userLanguage', document.getElementById('userLanguage').value);
        localStorage.setItem('dateFormat', document.getElementById('dateFormat').value);
        localStorage.setItem('emailNotifications', document.getElementById('emailNotifications').checked);
        localStorage.setItem('smsNotifications', document.getElementById('smsNotifications').checked);
        showAlert('Preferences saved!', 'success');
    });

    // Helper functions
    function getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        const activeTab = document.querySelector('.tab-content.active form');
        if (activeTab) {
            activeTab.parentNode.insertBefore(alertDiv, activeTab);
            setTimeout(() => alertDiv.remove(), 3000);
        }
    }
});