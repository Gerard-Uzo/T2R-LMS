document.addEventListener('DOMContentLoaded', function () {
    // Get the current course based on the URL
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage); // Debug log

    // Sample courses data
    const coursesData = {
        'courses-course-6.htm': {
            title: "Gold Masterclass",
            instructor: "Philip Ajaebili",
            description: "Master the art of trading gold with Philip Ajaebili's comprehensive Gold Masterclass.",
            modules: [
                {
                    title: "Gold Market Fundamentals",
                    lessons: [
                        { title: "Introduction to Gold Trading", duration: "20 min", completed: false },
                        { title: "Understanding Gold Market Dynamics", duration: "25 min", completed: false },
                        { title: "Factors Affecting Gold Prices", duration: "30 min", completed: false }
                    ]
                },
                {
                    title: "Advanced Gold Trading Strategies",
                    lessons: [
                        { title: "Technical Analysis for Gold", duration: "35 min", completed: false },
                        { title: "Gold Trading Patterns", duration: "30 min", completed: false },
                        { title: "Risk Management in Gold Trading", duration: "25 min", completed: false }
                    ]
                },
                {
                    title: "Live Trading Sessions",
                    lessons: [
                        { title: "Market Analysis Session", duration: "45 min", completed: false },
                        { title: "Live Gold Trading Demo", duration: "60 min", completed: false }
                    ]
                }
            ],
            resources: [
                { title: "Gold Trading Manual", type: "PDF", size: "3.5 MB" },
                { title: "Trading Templates", type: "ZIP", size: "1.8 MB" },
                { title: "Market Analysis Tools", type: "PDF", size: "2.2 MB" }
            ],
            questions: [
                {
                    question: "Is this course suitable for beginners?",
                    answer: "Yes, while some trading knowledge is helpful, this course is structured to accommodate beginners while also providing advanced insights for experienced traders.",
                    date: "2025-08-01",
                    author: "Philip Ajaebili (Instructor)"
                }
            ]
        },
        'courses-course-1.htm': {
            title: "Psychology Of Trading",
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
                        { title: "Create a structured trading plan", duration: "15 min", completed: false },
                        { title: "Develop the discipline", duration: "20 min", completed: false }
                    ]
                }
            ],
            resources: [
                { title: "Course Slides", type: "PDF", size: "2.4 MB" },
                { title: "Trading Psychology Guide", type: "PDF", size: "1.2 MB" }
            ],
            questions: [
                {
                    question: "Is this course suitable for beginners?",
                    answer: "Yes, this course is designed for beginners with no prior Trading experience.",
                    date: "2023-05-15",
                    author: "Amaka"
                }
            ]
        },
        'courses-course-2.htm': {
            title: "Indicator System",
            instructor: "Ochidi Prince",
            description: "Master the Complete Retail Trading (CRT) methodology with Bishop Fisayo's comprehensive course.",
            modules: [
                {
                    title: "Ichimoku",
                    lessons: [
                        { title: "What is CRT?", duration: "15 min", completed: false },
                        { title: "Market Structure Basics", duration: "20 min", completed: false },
                        { title: "Price Action Fundamentals", duration: "25 min", completed: false }
                    ]
                },
                // {
                //     title: "Advanced CRT Strategies",
                //     lessons: [
                //         { title: "Reading Market Structure", duration: "30 min", completed: false },
                //         { title: "Risk Management in CRT", duration: "25 min", completed: false },
                //         { title: "Live Trading Session", duration: "45 min", completed: false }
                //     ]
                // }
            ],
            resources: [
                { title: "Indicator System Manual", type: "PDF", size: "3.1 MB" },
                { title: "Trading Templates", type: "ZIP", size: "1.5 MB" }
            ],
            questions: [
                {
                    question: "How is CRT different from other trading methods?",
                    answer: "CRT focuses on retail trading perspectives and market structure analysis.",
                    date: "2023-06-20",
                    author: "Bishop Fisayo (Instructor)"
                }
            ]
        },
        'courses-course-3.htm': {
            title: "Trading For Beginners",
            instructor: "Preye",
            description: "Get started with trading fundamentals in this comprehensive beginner's course. Learn the essential concepts, strategies, and principles that will help you build a strong foundation for your trading journey.",
            modules: [
                {
                    title: "Intoduction to Trading",
                    lessons: [
                        { title: "What is Trading?", duration: "15 min", completed: false },
                        { title: "Different Types of Markets", duration: "20 min", completed: false },
                        { title: "Basic Trading Terminology", duration: "25 min", completed: false }
                    ]
                },
                {
                    title: "Technical Analysis Basics",
                    lessons: [
                        { title: "Understanding Price Charts", duration: "30 min", completed: false },
                        { title: "Support and Resistance", duration: "25 min", completed: false },
                        { title: "Basic Chart Patterns", duration: "45 min", completed: false }
                    ]
                },
                {
                    title: "Risk Management",
                    lessons: [
                        { title: "Understanding Risk vs Reward", duration: "30 min", completed: false },
                        { title: "Position Sizing Strategies", duration: "25 min", completed: false },
                        { title: "Stop Loss and Take Profit", duration: "45 min", completed: false }
                    ]
                },
                {
                    title: "Trading Strategy",
                    lessons: [
                        { title: "Creating a Trading Plan", duration: "30 min", completed: false },
                        { title: "Entry and Exit Rules", duration: "25 min", completed: false },
                        { title: "Trading Psychology", duration: "45 min", completed: false }
                    ]
                },
                {
                    title: "Practice and Implementation",
                    lessons: [
                        { title: "Demo Trading", duration: "30 min", completed: false },
                        { title: "Common Beginner Mistakes", duration: "25 min", completed: false },
                        { title: "Next Steps in Your Trading Journey", duration: "45 min", completed: false }
                    ]
                }
                
            ],
            resources: [
                { title: "Trading for beginners Manual", type: "PDF", size: "3.1 MB" },
                { title: "Trading Templates", type: "ZIP", size: "1.5 MB" }
            ],
            questions: [
                {
                    question: "How is CRT different from other trading methods?",
                    answer: "CRT focuses on retail trading perspectives and market structure analysis.",
                    date: "2023-06-20",
                    author: "Preye (Instructor)"
                }
            ]
        },
            'courses-course-4.htm': {
            title: "Technical Analysis",
            instructor: "Ochidi Prince",
            description: "Master the Complete Retail Trading (CRT) methodology with Bishop Fisayo's comprehensive course.",
            modules: [
                {
                    title: "Technical Analysis",
                    lessons: [
                        { title: "Price Action", duration: "15 min", completed: false },
                        { title: "Candle Stick Patterns", duration: "20 min", completed: false },
                        { title: "Supply & Demand", duration: "25 min", completed: false },
                        { title: "Smart Money Concept", duration: "30 min", completed: false },
                    ]
                },
               
            ],
            resources: [
                { title: "Technical Analysis Manual", type: "PDF", size: "3.1 MB" },
                { title: "Trading Templates", type: "ZIP", size: "1.5 MB" }
            ],
            questions: [
                {
                    question: "How is CRT different from other trading methods?",
                    answer: "CRT focuses on retail trading perspectives and market structure analysis.",
                    date: "2023-06-20",
                    author: "Bishop Fisayo (Instructor)"
                }
            ]
        },
        'courses-course-5.htm': {
            title: "Trendline Strategy",
            instructor: "Bishop Fisayo",
            description: "Master the Complete Retail Trading (CRT) methodology with Bishop Fisayo's comprehensive course.",
            modules: [
                {
                    title: "Treadline Strategy",
                    lessons: [
                        { title: "Classic treadline [CLT]", duration: "15 min", completed: false },
                        { title: "Break & retest treadline [BART]", duration: "20 min", completed: false },
                        { title: "Break & retest support [BARS]", duration: "25 min", completed: false },  
                    ]
                },
               
            ],
            resources: [
                { title: "Treadline Strategy", type: "PDF", size: "3.1 MB" },
                { title: "Trading Templates", type: "ZIP", size: "1.5 MB" }
            ],
            questions: [
                {
                    question: "How is CRT different from other trading methods?",
                    answer: "CRT focuses on retail trading perspectives and market structure analysis.",
                    date: "2023-06-20",
                    author: "Bishop Fisayo (Instructor)"
                }
            ]
        },
    };

    // Get the course data based on the current page
    const course = coursesData[currentPage] || coursesData['courses-course-1.htm'];

    // Update course details
    const titleElement = document.querySelector('.course-hero h1');
    const instructorElement = document.querySelector('.instructor');
    const descriptionElement = document.querySelector('.course-description');

    if (titleElement) titleElement.textContent = course.title;
    if (instructorElement) instructorElement.textContent = `By ${course.instructor}`;
    if (descriptionElement) descriptionElement.textContent = course.description;

    // Render modules
    const modulesList = document.querySelector('.modules-list');
    if (modulesList && course.modules) {
        modulesList.innerHTML = ''; // Clear existing modules

        course.modules.forEach(module => {
            const moduleEl = document.createElement('div');
            moduleEl.className = 'module';
            moduleEl.innerHTML = `
                <div class="module-header">
                    <h4>${module.title}</h4>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="lessons-list" style="display: none;">
                    ${module.lessons.map(lesson => `
                        <a href="#" class="lesson ${lesson.completed ? 'complete' : ''}">
                            <i class="fas ${lesson.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                            <span>${lesson.title}</span>
                            <span>${lesson.duration}</span>
                        </a>
                    `).join('')}
                </div>
            `;

            // Add click event for module header
            const header = moduleEl.querySelector('.module-header');
            const lessonsList = moduleEl.querySelector('.lessons-list');
            const icon = header.querySelector('i');

            header.addEventListener('click', () => {
                const isExpanded = lessonsList.style.display === 'block';
                lessonsList.style.display = isExpanded ? 'none' : 'block';
                icon.classList.toggle('fa-chevron-down', !isExpanded);
                icon.classList.toggle('fa-chevron-up', isExpanded);
            });

            modulesList.appendChild(moduleEl);
        });
    }

    // Render resources
    const resourcesList = document.querySelector('.resources-list');
    if (resourcesList && course.resources) {
        resourcesList.innerHTML = course.resources.map(resource => `
            <div class="resource-item">
                <i class="fas ${resource.type === 'PDF' ? 'fa-file-pdf' : 'fa-file-archive'}"></i>
                <div class="resource-info">
                    <h4>${resource.title}</h4>
                    <div class="resource-meta">${resource.type} • ${resource.size}</div>
                </div>
                <button class="btn btn-outline btn-sm">Download</button>
            </div>
        `).join('');

        // Add download button handlers
        resourcesList.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const resourceTitle = this.closest('.resource-item').querySelector('h4').textContent;
                alert(`Downloading: ${resourceTitle}`);
            });
        });
    }

    // Render Q&A
    const qaList = document.querySelector('.qa-list');
    if (qaList && course.questions) {
        qaList.innerHTML = course.questions.map(qa => `
            <div class="qa-item">
                <div class="qa-question">${qa.question}</div>
                <div class="qa-meta">Asked by ${qa.author} on ${new Date(qa.date).toLocaleDateString()}</div>
                ${qa.answer ? `<div class="qa-answer">${qa.answer}</div>` : ''}
            </div>
        `).join('');
    }

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
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
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // Action buttons handlers
    const startButton = document.querySelector('.hero-actions .btn-primary');
    if (startButton) {
        startButton.addEventListener('click', function () {
            alert(`Starting ${course.title}!`);
        });
    }

    const wishlistButton = document.querySelector('.hero-actions .btn-outline');
    if (wishlistButton) {
        wishlistButton.addEventListener('click', function () {
            alert(`Added ${course.title} to your wishlist!`);
        });
    }
});
