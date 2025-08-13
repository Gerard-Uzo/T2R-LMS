// config.js
const Config = {
    API_BASE_URL: 'http://localhost:3000/api', // Change for production
    DEFAULT_AVATAR: 'assets/default-avatar.jpg',
    THEME: {
        primaryBlue: '#2962ff',
        primaryYellow: '#ffd600'
    },
    ROUTES: {
        PUBLIC: ['index.html', 'login.html', 'register.html'],
        PROTECTED: ['dashboard.html', 'profile.html']
    }
};