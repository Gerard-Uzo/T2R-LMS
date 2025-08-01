// admin-courses.js - Admin Courses Management
document.addEventListener('DOMContentLoaded', function() {
    // Get courses from localStorage or initialize with sample data
    let courses = JSON.parse(localStorage.getItem('courses')) || [
        {
            id: 1,
            title: 'Psychology of Trading',
            instructor: 'Ebitimi Oglafa',
            category: 'Psychology',
            students: 850,
            status: 'active',
            description: 'This comprehensive course will teach you how to win in the psychological game of trading.',
            modules: []
        },
        {
            id: 2,
            title: 'CRT',
            instructor: 'Bishop Fisayo',
            category: 'CRT',
            students: 720,
            status: 'active',
            description: 'Master the CRT trading methodology.',
            modules: []
        }
    ];

    // Save courses to localStorage
    function saveCourses() {
        localStorage.setItem('courses', JSON.stringify(courses));
        updateStudentPortalCourses();
    }

    // Update student portal courses
    function updateStudentPortalCourses() {
        const studentCourses = courses.map(course => ({
            id: course.id,
            title: course.title,
            instructor: course.instructor,
            rating: 4.5,
            students: course.students,
            duration: "20 hours",
            image: "assets/NAS100_2025-04-23_18-32-28.png",
            isNew: false,
            price: 0,
            category: course.category
        }));
        localStorage.setItem('studentCourses', JSON.stringify(studentCourses));
    }

    // DOM elements
    const coursesTableBody = document.getElementById('coursesTableBody');
    const addCourseBtn = document.getElementById('addCourseBtn');
    const addCourseModal = document.getElementById('addCourseModal');
    const closeModalBtn = addCourseModal.querySelector('.close-btn');
    const cancelBtn = addCourseModal.querySelector('.cancel-btn');
    const addCourseForm = document.getElementById('addCourseForm');
    const courseSearch = document.getElementById('courseSearch');
    const courseCategoryFilter = document.getElementById('courseCategoryFilter');
    const courseStatusFilter = document.getElementById('courseStatusFilter');

    // Generate unique ID for new courses
    function generateId() {
        return courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    }

    // Populate courses table
    function renderCourses(filteredCourses = courses) {
        if (coursesTableBody) {
            coursesTableBody.innerHTML = '';

            filteredCourses.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="course-info">
                            <img src="assets/course-placeholder.jpg" alt="Course" class="course-thumbnail">
                            <div>
                                <h4>${course.title}</h4>
                                <small>${course.modules.length} Modules</small>
                            </div>
                        </div>
                    </td>
                    <td>${course.instructor}</td>
                    <td><span class="badge badge-blue">${course.category}</span></td>
                    <td>${course.students}</td>
                    <td><span class="badge ${course.status === 'active' ? 'badge-green' : course.status === 'draft' ? 'badge-yellow' : 'badge-gray'}">${course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon edit-course" data-id="${course.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon delete-course" data-id="${course.id}"><i class="fas fa-trash"></i></button>
                            <button class="btn-icon view-course" data-id="${course.id}"><i class="fas fa-eye"></i></button>
                        </div>
                    </td>
                `;
                coursesTableBody.appendChild(row);
            });

            // Add event listeners to action buttons
            document.querySelectorAll('.edit-course').forEach(btn => {
                btn.addEventListener('click', function() {
                    const courseId = parseInt(this.getAttribute('data-id'));
                    editCourse(courseId);
                });
            });

            document.querySelectorAll('.delete-course').forEach(btn => {
                btn.addEventListener('click', function() {
                    const courseId = parseInt(this.getAttribute('data-id'));
                    deleteCourse(courseId);
                });
            });

            document.querySelectorAll('.view-course').forEach(btn => {
                btn.addEventListener('click', function() {
                    const courseId = parseInt(this.getAttribute('data-id'));
                    viewCourse(courseId);
                });
            });
        }
    }

    // Filter courses
    function filterCourses() {
        const searchTerm = courseSearch.value.toLowerCase();
        const categoryFilter = courseCategoryFilter.value;
        const statusFilter = courseStatusFilter.value;

        const filtered = courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                                 course.instructor.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || course.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        renderCourses(filtered);
    }

    // Add new course
    function addCourse(courseData) {
        const newCourse = {
            id: generateId(),
            title: courseData.title,
            instructor: courseData.instructor,
            category: courseData.category,
            status: courseData.status,
            description: courseData.description,
            students: 0,
            modules: []
        };

        courses.push(newCourse);
        saveCourses();
        renderCourses();
    }

    // Edit course
    function editCourse(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        // Populate modal with course data
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseInstructor').value = course.instructor;
        document.getElementById('courseCategory').value = course.category;
        document.getElementById('courseStatus').value = course.status;
        document.getElementById('courseDescription').value = course.description;

        // Change modal title and submit button
        document.querySelector('#addCourseModal .modal-header h3').textContent = 'Edit Course';
        document.querySelector('#addCourseForm button[type="submit"]').textContent = 'Update Course';

        // Show modal
        addCourseModal.style.display = 'flex';

        // Update form submit handler for editing
        const originalSubmit = addCourseForm.onsubmit;
        addCourseForm.onsubmit = function(e) {
            e.preventDefault();

            // Update course data
            course.title = document.getElementById('courseTitle').value;
            course.instructor = document.getElementById('courseInstructor').value;
            course.category = document.getElementById('courseCategory').value;
            course.status = document.getElementById('courseStatus').value;
            course.description = document.getElementById('courseDescription').value;

            saveCourses();
            renderCourses();
            closeModal();

            // Restore original submit handler
            addCourseForm.onsubmit = originalSubmit;
        };
    }

    // Delete course
    function deleteCourse(courseId) {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            courses = courses.filter(c => c.id !== courseId);
            saveCourses();
            renderCourses();
        }
    }

    // View course
    function viewCourse(courseId) {
        alert(`Viewing course ${courseId}. In a real implementation, this would redirect to the course page.`);
    }

    // Handle add course form submission
    function handleAddCourseSubmit(e) {
        e.preventDefault();

        const courseData = {
            title: document.getElementById('courseTitle').value,
            instructor: document.getElementById('courseInstructor').value,
            category: document.getElementById('courseCategory').value,
            status: document.getElementById('courseStatus').value,
            description: document.getElementById('courseDescription').value
        };

        addCourse(courseData);
        closeModal();
    }

    // Modal functions
    function openModal() {
        // Reset modal for adding new course
        document.querySelector('#addCourseModal .modal-header h3').textContent = 'Add New Course';
        document.querySelector('#addCourseForm button[type="submit"]').textContent = 'Save Course';
        addCourseForm.reset();
        addCourseForm.onsubmit = handleAddCourseSubmit;
        addCourseModal.style.display = 'flex';
    }

    function closeModal() {
        addCourseModal.style.display = 'none';
        addCourseForm.reset();
    }

    // Event listeners
    addCourseBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    addCourseModal.addEventListener('click', function(e) {
        if (e.target === addCourseModal) {
            closeModal();
        }
    });

    courseSearch.addEventListener('input', filterCourses);
    courseCategoryFilter.addEventListener('change', filterCourses);
    courseStatusFilter.addEventListener('change', filterCourses);

    // Initialize
    saveCourses();
    renderCourses();
});