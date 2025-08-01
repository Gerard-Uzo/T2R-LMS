document.addEventListener('DOMContentLoaded', function() {
    // Sample course data (in a real app, this would come from an API)
    const courses = [
        {
            id: 1,
            title: "Psychology  of Trading",
            instructor: "Ebitimi Oglafa",
            rating: 4.8,
            students: 850,
            duration: "32 hours",
            image: "assets/NAS100_2025-04-23_18-32-28.png",
            isNew: true,
            price: 0,
            category: "Psychology of Trading"
        },
        {
            id: 2,
            title: "CRT",
            instructor: "Bishop Fisayo",
            rating: 4.7,
            students: 620,
            duration: "18 hours",
            image: "assets/NAS100_2025-04-23_18-32-28.png",
            isNew: false,
            price: 0,
            category: "CRT"
        },
        {
            id: 3,
            title: "Depature Leg",
            instructor: "Kufre",
            rating: 4.9,
            students: 450,
            duration: "25 hours",
            image: "assets/NAS100_2025-04-23_18-32-28.png",
            isNew: false,
            price: 0,
            category: "Depature leg"
        },
        {
            id: 4,
            title: "Gold Masterclass",
            instructor: "Phillip Ajaebili",
            rating: 4.6,
            students: 380,
            duration: "20 hours",
            image: "assets/NAS100_2025-04-23_18-32-28.png",
            isNew: true,
            price: 44.99,
            category: "Masterclass"
        }
    ];

    const coursesGrid = document.querySelector('.courses-grid');
    const searchInput = document.querySelector('.search-bar input');
    const categoryFilter = document.querySelector('.category-filter');

    // Render courses
    function renderCourses(filteredCourses) {
        coursesGrid.innerHTML = '';
        const coursesToRender = filteredCourses || courses;

        if (coursesToRender.length === 0) {
            coursesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                    <h3>No courses found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        coursesToRender.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.onclick = `window.location.href='courses-course-${course.id}.htm'`;
            courseCard.innerHTML = `
                <div class="course-image" style="background-image: url('${course.image}')">
                    ${course.isNew ? '<div class="course-badge">New</div>' : ''}
                </div>
                <div class="course-details">
                    <h3>${course.title}</h3>
                    <p class="course-instructor">By ${course.instructor}</p>
                    <div class="course-meta">
                        <span><i class="fas fa-star"></i> ${course.rating} (${course.students})</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    </div>
                    <div class="course-footer">
                        <span class="price">$${course.price.toFixed(2)}</span>
                        <button class="btn btn-outline btn-sm">View Course</button>
                    </div>
                </div>
            `;
            coursesGrid.appendChild(courseCard);
        });

        // Add event listeners to course cards
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    const courseId = this.getAttribute('onclick').match(/\d+/)[0];
                    window.location.href = `courses-course-${courseId}.htm`;
                }
            });
        });

        // View course button functionality
        document.querySelectorAll('.course-card .btn-outline').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const courseId = this.closest('.course-card').getAttribute('onclick').match(/\d+/)[0];
                window.location.href = `courses-course-${courseId}.htm`;
            });
        });
    }

    // Filter courses based on search and category
    function filterCourses() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filtered = courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                                course.instructor.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'All Categories' ||
                                   course.category === category;
            return matchesSearch && matchesCategory;
        });

        renderCourses(filtered);
    }

    // Event listeners
    searchInput.addEventListener('input', filterCourses);
    categoryFilter.addEventListener('change', filterCourses);

    // Initial render
    renderCourses();
});