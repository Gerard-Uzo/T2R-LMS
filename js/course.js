document.addEventListener('DOMContentLoaded', function() {
    // Get course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || 1; // Default to course 1 if no ID

    // Sample course data (in a real app, fetch from API)
    const course = {
        id: 1,
        title: "Complete Psychology Of Trading",
        instructor: "Ebitimi Oglafa",
        description: "This comprehensive course will teach you how to win in the psychological game of trading.",
        modules: [
            {
                title: "Psychology in Trading",
                lessons: [
                    { title: "Introduction to Psychology", duration: "15 min", completed: true },
                    { title: "Common mistakes amongst traders", duration: "20 min", completed: true },
                    { title: "Failure as a catalyst", duration: "18 min", completed: false }
                ]
            },
            {
                title: "How to kill any fear when trading in the market",
                lessons: [
                    { title: "Embrace the fear", duration: "18 min", completed: false },
                    { title: "Understand why you are afraid", duration: "15 min", completed: false },
                    { title: "Conquer the fear", duration: "20 min", completed: false }
                ]
            },
            {
                title: "Creating a structured plan for yourself",
                lessons: [
                    { title: "Create a structured trading plan according to your psychological state", duration: "15 min", completed: false },
                    { title: "Develop the discipling to follow through this plan", duration: "20 min", completed: false }
                ]
            }
        ],
        resources: [
            { title: "Course Slides", type: "PDF", size: "2.4 MB" },
            { title: "Starter Code", type: "ZIP", size: "5.1 MB" },
            { title: "Cheat Sheets", type: "PDF", size: "1.2 MB" }
        ],
        questions: [
            {
                question: "Is this course suitable for beginners?",
                answer: "Yes, this course is designed for beginners with no prior Trading experience.",
                date: "2023-05-15",
                author: "Amaka"
            },
            {
                question: "How do i become more confident?",
                answer: "Follow through with Trade2Retire.",
                date: "2023-05-10",
                author: "Ebitimi Oglafa (Instructor)"
            }
        ]
    };

    // Update course details
    document.querySelector('.course-hero h1').textContent = course.title;
    document.querySelector('.instructor').textContent = `By ${course.instructor}`;
    document.querySelector('.course-description').textContent = course.description;

    // Render modules
    const modulesList = document.querySelector('.modules-list');
    course.modules.forEach(module => {
        const moduleEl = document.createElement('div');
        moduleEl.className = 'module';
        moduleEl.innerHTML = `
            <div class="module-header">
                <h4>${module.title}</h4>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="lessons-list"></div>
        `;
        modulesList.appendChild(moduleEl);

        const lessonsList = moduleEl.querySelector('.lessons-list');
        module.lessons.forEach(lesson => {
            const lessonEl = document.createElement('a');
            lessonEl.className = `lesson ${lesson.completed ? 'complete' : ''}`;
            lessonEl.href = '#';
            lessonEl.innerHTML = `
                <i class="fas ${lesson.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                <span>${lesson.title}</span>
                <span>${lesson.duration}</span>
            `;
            lessonsList.appendChild(lessonEl);
        });

        // Toggle module expansion
        moduleEl.querySelector('.module-header').addEventListener('click', function() {
            const icon = this.querySelector('i');
            const lessons = this.nextElementSibling;

            if (lessons.style.display === 'block') {
                lessons.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                lessons.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });

    // Render resources
    const resourcesTab = document.querySelector('#resources');
    if (resourcesTab) {
        const resourcesList = resourcesTab.querySelector('.resources-list');
        course.resources.forEach(resource => {
            const resourceEl = document.createElement('div');
            resourceEl.className = 'resource-item';
            resourceEl.innerHTML = `
                <i class="fas fa-file-${resource.type.toLowerCase()}"></i>
                <div class="resource-info">
                    <h4>${resource.title}</h4>
                    <div class="resource-meta">${resource.type} • ${resource.size}</div>
                </div>
                <button class="btn btn-outline btn-sm">Download</button>
            `;
            resourcesList.appendChild(resourceEl);
        });
    }

    // Render Q&A
    const qaTab = document.querySelector('#qa');
    if (qaTab) {
        const qaList = qaTab.querySelector('.qa-list');
        course.questions.forEach(qa => {
            const qaEl = document.createElement('div');
            qaEl.className = 'qa-item';
            qaEl.innerHTML = `
                <div class="qa-question">${qa.question}</div>
                <div class="qa-meta">Asked by ${qa.author} on ${new Date(qa.date).toLocaleDateString()}</div>
                ${qa.answer ? `<div class="qa-answer">${qa.answer}</div>` : ''}
            `;
            qaList.appendChild(qaEl);
        });
    }

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

    // Enroll button
    document.querySelector('.hero-actions .btn-primary').addEventListener('click', function() {
        // In a real app, this would call an API to enroll the user
        alert(`You have been enrolled in ${course.title}!`);
        // Redirect to first lesson
        window.location.href = '#';
    });

    // Wishlist button
    document.querySelector('.hero-actions .btn-outline').addEventListener('click', function() {
        alert(`Added ${course.title} to your wishlist!`);
    });

    // Download buttons
    document.querySelectorAll('.resource-item .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const resourceTitle = this.closest('.resource-item').querySelector('h4').textContent;
            alert(`Downloading: ${resourceTitle}`);
        });
    });
});