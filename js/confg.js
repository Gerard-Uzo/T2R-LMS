// config.js
const Config = {
    API_BASE_URL: 'http://localhost:3000/api',
    DEFAULT_AVATAR: 'assets/default-avatar.jpg',
    THEME: {
        primaryBlue: '#2962ff',
        primaryYellow: '#ffd600'
    },
    ROUTES: {
        PUBLIC: ['index.html', 'login.htm', 'register.htm'],
        PROTECTED: ['dashboard.htm', 'profile.htm', 'settings.htm'],
        AUTH: ['login.htm', 'register.htm']
    },
    AUTH: {
        PASSWORD_MIN_LENGTH: 6,
        NAME_MIN_LENGTH: 2
    }
};

export default Config;