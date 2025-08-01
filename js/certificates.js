// certificates.js - Certificates Page
document.addEventListener('DOMContentLoaded', function() {
    // Sample certificate data (in a real app, fetch from API)
    const certificates = [
        {
            id: 1,
            title: "Gold Masterclass",
            date: "2025-03-15",
            image: "assets/cert1.jpg"
        },
        {
            id: 2,
            title: "Trading for begineers",
            date: "2025-05-02",
            image: "assets/cert2.jpg"
        }
    ];

    const certificatesGrid = document.querySelector('.certificates-grid');

    if (certificates.length === 0) {
        certificatesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-certificate"></i>
                <h3>No Certificates Yet</h3>
                <p>Complete courses to earn certificates that showcase your achievements</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
    } else {
        certificates.forEach(cert => {
            const certEl = document.createElement('div');
            certEl.className = 'certificate-card';
            certEl.innerHTML = `
                <div class="certificate-preview">
                    <img src="${cert.image}" alt="${cert.title}">
                </div>
                <div class="certificate-info">
                    <h3>${cert.title}</h3>
                    <p>Completed on: ${new Date(cert.date).toLocaleDateString()}</p>
                    <div class="certificate-actions">
                        <button class="btn btn-outline">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn btn-primary">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            `;
            certificatesGrid.appendChild(certEl);
        });

        // Download button functionality
        document.querySelectorAll('.certificate-actions .btn-outline').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const certTitle = this.closest('.certificate-info').querySelector('h3').textContent;
                alert(`Downloading certificate: ${certTitle}`);
                // In a real app, this would download the certificate file
            });
        });

        // Share button functionality
        document.querySelectorAll('.certificate-actions .btn-primary').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const certTitle = this.closest('.certificate-info').querySelector('h3').textContent;
                if (navigator.share) {
                    navigator.share({
                        title: `My ${certTitle} Certificate`,
                        text: `I earned a certificate for completing ${certTitle} on LearnHub!`,
                        url: window.location.href
                    }).catch(err => {
                        console.log('Error sharing:', err);
                    });
                } else {
                    alert(`Share your ${certTitle} certificate on social media!`);
                }
            });
        });
    }
});