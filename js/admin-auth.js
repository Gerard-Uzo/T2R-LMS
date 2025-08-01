document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminRegisterForm = document.getElementById('adminRegisterForm');

    // Initialize admin users in localStorage if not exists
    if (!localStorage.getItem('adminUsers')) {
        const initialAdmins = [
            {
                id: 'admin1',
                email: 'superadmin@trade2retire.com',
                password: 'superadmin123',
                name: 'Super Admin',
                avatar: 'assets/default-avatar.jpg',
                role: 'superadmin',
                courses: []
            }
        ];
        localStorage.setItem('adminUsers', JSON.stringify(initialAdmins));
    }

    // Admin login form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = adminLoginForm.email.value.trim();
            const password = adminLoginForm.password.value.trim();

            // Validate email format
            if (!email.endsWith('@trade2retire.com')) {
                alert('Please use your @trade2retire.com admin email');
                return;
            }

            const adminUsers = JSON.parse(localStorage.getItem('adminUsers'));
            const admin = adminUsers.find(user =>
                user.email === email && user.password === password
            );

            if (admin) {
                // Show loading state
                const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

                // Store in ADMIN session
                sessionStorage.setItem('adminUser', JSON.stringify(admin));
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.htm';
                }, 1000);
            } else {
                alert('Invalid admin credentials');
            }
        });
    }

    // Admin registration form (only for superadmin to create new admins)
    if (adminRegisterForm) {
        adminRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = adminRegisterForm.fullName.value.trim();
            const email = adminRegisterForm.email.value.trim();
            const password = adminRegisterForm.password.value.trim();
            const confirmPassword = adminRegisterForm.confirmPassword.value.trim();

            // Validate email format
            if (!email.endsWith('@trade2retire.com')) {
                alert('Admin emails must use @trade2retire.com domain');
                return;
            }

            // Validate password
            if (password.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || []);

            // Check if email already exists
            if (adminUsers.some(user => user.email === email)) {
                alert('Admin email already registered');
                return;
            }

            // Create new admin
            const newAdmin = {
                id: 'admin' + (adminUsers.length + 1),
                email,
                password,
                name,
                avatar: 'assets/default-avatar.jpg',
                role: 'courseadmin',
                courses: []
            };

            // Save new admin
            adminUsers.push(newAdmin);
            localStorage.setItem('adminUsers', JSON.stringify(adminUsers));

            alert('Admin account created successfully!');
            window.location.href = 'admin-login.htm';
        });
    }
});