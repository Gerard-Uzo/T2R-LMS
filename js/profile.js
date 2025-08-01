// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navLinks?.classList.remove('active');
        });
    });

    // Page loader
    window.addEventListener('load', function() {
        const pageLoader = document.querySelector('.page-loader');
        if (pageLoader) {
            setTimeout(() => {
                pageLoader.classList.add('hidden');
            }, 500);
        }
    });
});