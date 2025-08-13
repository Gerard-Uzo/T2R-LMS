// Services page interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Service details data
    const serviceDetails = {
        beginner: {
            title: "Beginner to Pro Trader Program",
            description: `Our signature program transforms complete beginners into confident, skilled traders in just 2 months. 
                         This comprehensive course covers everything you need to succeed in trading.`,
            curriculum: [
                "Foundation of Trading",
                "Technical Analysis Mastery",
                "Risk Management Strategies",
                "Psychology of Trading",
                "Live Trading Sessions",
                "Market Analysis Techniques"
            ],
            duration: "2 months",
            includes: [
                "24/7 Access to Course Materials",
                "Live Trading Sessions",
                "Trading Community Access",
                "Personal Progress Tracking",
                "Certificate of Completion",
                "Lifetime Updates"
            ],
            price: "Contact for Pricing"
        },
        vip: {
            title: "VIP 1-on-1 Mentorship",
            description: `Get personalized guidance from experienced traders who will help you develop your 
                         trading strategy and accelerate your growth.`,
            benefits: [
                "Personalized Trading Strategy",
                "Direct Mentor Access",
                "Portfolio Review",
                "Risk Assessment",
                "Performance Optimization",
                "Weekly 1-on-1 Sessions"
            ],
            duration: "3 months",
            includes: [
                "Weekly Private Sessions",
                "24/7 WhatsApp Support",
                "Trade Analysis",
                "Strategy Development",
                "Performance Reviews",
                "Custom Training Plan"
            ],
            price: "Contact for Pricing"
        },
        ai: {
            title: "AI Trading Masterclass",
            description: `Master the integration of artificial intelligence in trading. Learn how to leverage 
                         AI tools and algorithms for better trading decisions.`,
            modules: [
                "AI in Market Analysis",
                "Machine Learning Basics",
                "Automated Trading Systems",
                "Pattern Recognition",
                "Risk Management with AI",
                "Algorithm Development"
            ],
            duration: "6 weeks",
            includes: [
                "AI Trading Tools Access",
                "Code Examples",
                "Strategy Backtesting",
                "Live AI Analysis",
                "Trading Algorithms",
                "Technical Support"
            ],
            price: "Contact for Pricing"
        },
        gold: {
            title: "Gold Masterclass",
            description: `Specialized training focused on gold trading. Learn specific strategies and 
                         techniques for trading gold successfully in various market conditions.`,
            topics: [
                "Gold Market Fundamentals",
                "Technical Analysis for Gold",
                "Risk Management",
                "Market Psychology",
                "Entry and Exit Strategies",
                "Portfolio Management"
            ],
            duration: "4 weeks",
            includes: [
                "Market Analysis Tools",
                "Trading Strategies",
                "Risk Management System",
                "Live Trading Sessions",
                "Community Access",
                "Course Materials"
            ],
            price: "Contact for Pricing"
        }
    };

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Modal functionality
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.querySelector('.close-btn');
    const learnMoreBtns = document.querySelectorAll('.learn-more-btn');

    function openModal(serviceType) {
        const details = serviceDetails[serviceType];
        const modalBody = document.querySelector('.modal-body');
        
        // Create modal content based on service type
        // Update modal content with new structure
        modalBody.innerHTML = '';
        
        // Create header section
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.innerHTML = `
            <h2>${details.title}</h2>
            <p>${details.description}</p>
        `;
        
        // Create content section
        const content = document.createElement('div');
        content.className = 'service-detail-grid';
        
        // Duration and Price Card
        content.innerHTML = `
            <div class="detail-card highlight">
                <h3><i class="fas fa-clock"></i> Program Details</h3>
                <div class="price-tag">${details.price}</div>
                <ul>
                    <li><i class="fas fa-calendar-alt"></i> Duration: ${details.duration}</li>
                    <li><i class="fas fa-users"></i> Limited Slots Available</li>
                    <li><i class="fas fa-certificate"></i> Certificate Upon Completion</li>
                </ul>
            </div>
        `;

        // Add curriculum/topics card based on service type
        let learningContent = '';
        if (serviceType === 'beginner') {
            learningContent = `
                <div class="detail-card">
                    <h3><i class="fas fa-book"></i> Curriculum</h3>
                    <ul>
                        ${details.curriculum.map(item => `
                            <li><i class="fas fa-check-circle"></i>${item}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        } else if (serviceType === 'vip') {
            learningContent = `
                <div class="detail-card">
                    <h3><i class="fas fa-star"></i> Key Benefits</h3>
                    <ul>
                        ${details.benefits.map(item => `
                            <li><i class="fas fa-check-circle"></i>${item}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        } else if (serviceType === 'ai') {
            learningContent = `
                <div class="detail-card">
                    <h3><i class="fas fa-robot"></i> AI Modules</h3>
                    <ul>
                        ${details.modules.map(item => `
                            <li><i class="fas fa-check-circle"></i>${item}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        } else if (serviceType === 'gold') {
            learningContent = `
                <div class="detail-card">
                    <h3><i class="fas fa-coins"></i> Trading Topics</h3>
                    <ul>
                        ${details.topics.map(item => `
                            <li><i class="fas fa-check-circle"></i>${item}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        content.innerHTML += learningContent;

        // Add What's Included card
        content.innerHTML += `
            <div class="detail-card">
                <h3><i class="fas fa-gift"></i> What's Included</h3>
                <ul>
                    ${details.includes.map(item => `
                        <li><i class="fas fa-check-circle"></i>${item}</li>
                    `).join('')}
                </ul>
                <a href="https://wa.me/2348067056395" class="contact-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> Contact Us to Enroll
                </a>
            </div>
        `;

        // Add header and content to modal
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = '';
        modalContent.appendChild(modalHeader);
        
        const modalBodyDiv = document.createElement('div');
        modalBodyDiv.className = 'modal-body';
        modalBodyDiv.appendChild(content);
        modalContent.appendChild(modalBodyDiv);
        
        // Add close button to header
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        modalHeader.appendChild(closeBtn);
        
        // Add click event to new close button
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.classList.add('active');
    }

    // Add click listeners to Learn More buttons
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceCard = e.target.closest('.service-card');
            const serviceType = serviceCard.dataset.service;
            openModal(serviceType);
        });
    });

    // Close modal functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});
