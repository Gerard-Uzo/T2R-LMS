// admin-students.js - Final working version
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Students page loaded'); // Debug log

    // Check admin auth
    const currentAdmin = JSON.parse(sessionStorage.getItem('adminUser'));
    if (!currentAdmin) {
        window.location.href = 'admin-login.htm';
        return;
    }

    // Initialize UI
    initAdminUI(currentAdmin);
    loadStudentsTable();

    // Setup event listeners
    setupEventListeners();
});

function initAdminUI(admin) {
    document.getElementById('sidebarAdminName').textContent = admin.name || 'Admin';
    document.getElementById('adminNameDisplay').textContent = admin.name || 'Admin';
}

function setupEventListeners() {
    // Mobile menu
    document.querySelector('.menu-toggle')?.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Logout
    document.getElementById('adminLogoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('adminUser');
            window.location.href = 'admin-login.htm';
        }
    });

    // Delete modal
    const deleteModal = document.getElementById('deleteStudentModal');
    if (deleteModal) {
        document.getElementById('closeDeleteModal')?.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });

        document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });

        document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
            const studentId = this.getAttribute('data-student-id');
            if (studentId && deleteStudent(studentId)) {
                deleteModal.style.display = 'none';
                showNotification('Student deleted successfully', 'success');
                loadStudentsTable();
            }
        });
    }

    // Search and filters
    document.getElementById('studentSearch')?.addEventListener('input', (e) => {
        filterStudents(e.target.value);
    });

    document.getElementById('statusFilter')?.addEventListener('change', () => {
        filterStudents();
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadStudentsTable() {
    console.log('Loading students table...'); // Debug log
    try {
        const students = getAllStudents();
        console.log('Retrieved students:', students); // Debug log

        if (!Array.isArray(students)) {
            throw new Error('Students data is not an array');
        }

        renderStudentsTable(students);
    } catch (error) {
        console.error('Error loading students:', error);
        showNotification('Error loading students. Please try again.', 'error');

        // Initialize with empty array if no students exist
        if (error.message.includes('Unexpected token') || error.message.includes('null')) {
            localStorage.setItem('students', JSON.stringify([]));
            renderStudentsTable([]);
        }
    }
}

function renderStudentsTable(students) {
    const tableBody = document.getElementById('studentsTableBody');
    const tableInfo = document.getElementById('tableInfo');

    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (!students || students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No students found</td>
            </tr>
        `;
        if (tableInfo) {
            tableInfo.textContent = 'Showing 0 of 0 students';
        }
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="student-info">
                    <img src="assets/default-avatar.jpg" alt="${student.name || 'Student'}" class="student-avatar">
                    <span>${student.name || 'No name'}</span>
                </div>
            </td>
            <td>${student.email || 'No email'}</td>
            <td>${student.courses?.length || 0} courses</td>
            <td>
                <select class="status-select" data-student-id="${student.id}">
                    <option value="true" ${student.active ? 'selected' : ''}>Active</option>
                    <option value="false" ${!student.active ? 'selected' : ''}>Inactive</option>
                </select>
            </td>
            <td>${student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Unknown'}</td>
            <td>
                <button class="btn-icon delete-btn" data-id="${student.id}" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

        // Status change handler
        row.querySelector('.status-select')?.addEventListener('change', function() {
            const newStatus = this.value === 'true';
            updateStudentStatus(student.id, newStatus);
        });

        // Delete handler
        row.querySelector('.delete-btn')?.addEventListener('click', function() {
            document.getElementById('confirmDeleteBtn').setAttribute('data-student-id', student.id);
            document.getElementById('deleteStudentModal').style.display = 'block';
        });

        tableBody.appendChild(row);
    });

    if (tableInfo) {
        tableInfo.textContent = `Showing ${students.length} of ${students.length} students`;
    }
}

function filterStudents(searchTerm = '') {
    try {
        const statusFilter = document.getElementById('statusFilter').value || 'all';
        const allStudents = getAllStudents() || [];

        const filtered = allStudents.filter(student => {
            const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               student.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' ||
                               (statusFilter === 'active' && student.active) ||
                               (statusFilter === 'inactive' && !student.active);
            return matchesSearch && matchesStatus;
        });

        renderStudentsTable(filtered);
    } catch (error) {
        console.error('Error filtering students:', error);
    }
}

function updateStudentStatus(studentId, newStatus) {
    try {
        const students = getAllStudents();
        const student = students.find(s => s.id === studentId);

        if (student) {
            student.active = newStatus;
            localStorage.setItem('students', JSON.stringify(students));
            showNotification(`Status updated to ${newStatus ? 'Active' : 'Inactive'}`, 'success');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('Failed to update status', 'error');
    }
}

function deleteStudent(studentId) {
    try {
        const students = getAllStudents();
        const updated = students.filter(s => s.id !== studentId);

        localStorage.setItem('students', JSON.stringify(updated));

        // Clear current user if deleted student is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id === studentId) {
            localStorage.removeItem('currentUser');
        }

        return true;
    } catch (error) {
        console.error('Error deleting student:', error);
        return false;
    }
}

function getAllStudents() {
    try {
        const students = localStorage.getItem('students');
        if (!students) {
            localStorage.setItem('students', JSON.stringify([]));
            return [];
        }
        return JSON.parse(students);
    } catch (error) {
        console.error('Error getting students:', error);
        return [];
    }
}