// settings.js - Account Settings
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Avatar upload
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');

    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
                // In a real app, upload to server
            };
            reader.readAsDataURL(file);
        }
    });

    // Password change form
    const passwordForm = document.querySelector('#security-tab form');
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const currentPassword = this.elements.currentPassword.value;
        const newPassword = this.elements.newPassword.value;
        const confirmPassword = this.elements.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }

        // In a real app, verify current password and update on server
        alert("Password changed successfully!");
        this.reset();
    });

    // Two-factor authentication toggle
    const twoFactorToggle = document.querySelector('#twoFactorToggle');
    twoFactorToggle.addEventListener('change', function() {
        if (this.checked) {
            // In a real app, enable 2FA via API
            alert("Two-factor authentication enabled. Please follow the setup instructions.");
        } else {
            // In a real app, disable 2FA via API
            alert("Two-factor authentication disabled.");
        }
    });
});