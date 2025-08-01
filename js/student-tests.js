document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const availableTestsContainer = document.getElementById('availableTests');
    const completedTestsContainer = document.getElementById('completedTests');
    const testModal = document.getElementById('testModal');
    const testResultsModal = document.getElementById('testResultsModal');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // State
    let currentTest = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timeLeft = 0;
    let timerInterval = null;
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { id: 'user-123', name: 'Unknown User' };
    const now = new Date();

    // Initialize
    init();

    function init() {
        setupEventListeners();
        renderAvailableTests();
        renderCompletedTests();
    }

    function setupEventListeners() {
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', switchTab);
        });

        // Test navigation
        document.getElementById('prevQuestionBtn').addEventListener('click', showPreviousQuestion);
        document.getElementById('nextQuestionBtn').addEventListener('click', showNextQuestion);
        document.getElementById('submitTestBtn').addEventListener('click', submitTest);

        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    }

    function switchTab(e) {
        const tabId = e.target.dataset.tab;

        // Update active tab
        tabBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tests`) {
                content.classList.add('active');
            }
        });
    }

    function renderAvailableTests() {
        const tests = getTests().filter(test =>
            test.status === 'active' &&
            new Date(test.dueDate) > now &&
            !getSubmissions().some(s => s.testId === test.id && s.userId === currentUser.id)
        );

        availableTestsContainer.innerHTML = '';

        if (tests.length === 0) {
            availableTestsContainer.innerHTML = '<p class="no-tests">No available tests at this time.</p>';
            return;
        }

        tests.forEach(test => {
            const course = getCourse(test.courseId);
            const dueDate = new Date(test.dueDate);
            const timeLeft = getTimeLeftString(dueDate);

            const testCard = document.createElement('div');
            testCard.className = 'test-card';
            testCard.dataset.id = test.id;
            testCard.innerHTML = `
                <h3>${test.title}</h3>
                <p><strong>Course:</strong> ${course?.title || 'Unknown'}</p>
                <p><strong>Questions:</strong> ${test.questions?.length || 0}</p>
                <p><strong>Duration:</strong> ${test.duration} minutes</p>
                <p><strong>Due:</strong> ${dueDate.toLocaleString()} (${timeLeft})</p>
                <p><strong>Passing Score:</strong> ${test.passingScore}%</p>
                <button class="btn start-test-btn">Start Test</button>
            `;
            availableTestsContainer.appendChild(testCard);
        });

        // Add event listeners to start buttons
        document.querySelectorAll('.start-test-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                startTest(e.target.closest('.test-card').dataset.id);
            });
        });
    }

    function getTimeLeftString(dueDate) {
        const diff = dueDate - now;
        if (diff <= 0) return 'Expired';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
        return 'Less than an hour left';
    }

    function renderCompletedTests() {
        const submissions = getSubmissions().filter(s => s.userId === currentUser.id);

        completedTestsContainer.innerHTML = '';

        if (submissions.length === 0) {
            completedTestsContainer.innerHTML = '<p class="no-tests">No completed tests yet.</p>';
            return;
        }

        submissions.forEach(sub => {
            const test = getTest(sub.testId);
            if (!test) return;

            const subEl = document.createElement('div');
            subEl.className = 'completed-test';
            subEl.innerHTML = `
                <div>
                    <h3>${test.title}</h3>
                    <p><strong>Course:</strong> ${getCourse(test.courseId)?.title || 'Unknown'}</p>
                    <p><strong>Date Taken:</strong> ${new Date(sub.date).toLocaleString()}</p>
                </div>
                <div class="test-result">
                    <p><strong>Score:</strong> ${sub.score}%</p>
                    <p><strong>Status:</strong> <span class="${sub.passed ? 'passed' : 'failed'}">${sub.passed ? 'Passed' : 'Failed'}</span></p>
                    <button class="btn view-results-btn" data-id="${sub.id}">View Results</button>
                </div>
            `;
            completedTestsContainer.appendChild(subEl);
        });

        // Add event listeners to view results buttons
        document.querySelectorAll('.view-results-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewTestResults(e.target.dataset.id);
            });
        });
    }

    function startTest(testId) {
        currentTest = getTest(testId);
        if (!currentTest) return;

        currentQuestionIndex = 0;
        userAnswers = Array(currentTest.questions.length).fill(null);
        timeLeft = currentTest.duration * 60;

        // Set test info
        document.getElementById('testTitle').textContent = currentTest.title;

        // Start timer
        startTimer();

        // Show first question
        showQuestion(currentQuestionIndex);

        // Open test modal
        testModal.classList.add('active');
    }

    function startTimer() {
        updateTimerDisplay();
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('testTimer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Change color when time is running low
        if (timeLeft <= 300) { // 5 minutes
            document.getElementById('testTimer').style.color = '#f44336';
        }
    }

    function showQuestion(index) {
        if (!currentTest || index < 0 || index >= currentTest.questions.length) return;

        const question = currentTest.questions[index];

        // Update progress
        document.getElementById('progressText').textContent =
            `Question ${index + 1} of ${currentTest.questions.length}`;
        document.getElementById('testProgressBar').style.width =
            `${((index + 1) / currentTest.questions.length) * 100}%`;

        // Update navigation buttons
        document.getElementById('prevQuestionBtn').disabled = index === 0;
        document.getElementById('nextQuestionBtn').textContent =
            index === currentTest.questions.length - 1 ? 'Finish' : 'Next';

        // Render question
        const questionContainer = document.getElementById('testQuestions');
        questionContainer.innerHTML = '';

        const questionEl = document.createElement('div');
        questionEl.className = 'question';
        questionEl.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="options-container"></div>
        `;

        const optionsContainer = questionEl.querySelector('.options-container');

        question.options.forEach((option, i) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            optionEl.innerHTML = `
                <input type="radio" name="question-${index}" id="option-${index}-${i}" value="${i}"
                    ${userAnswers[index] === i ? 'checked' : ''}>
                <label for="option-${index}-${i}">${String.fromCharCode(65 + i)}. ${option.text}</label>
            `;
            optionsContainer.appendChild(optionEl);
        });

        questionContainer.appendChild(questionEl);
    }

    function showPreviousQuestion() {
        saveAnswer(currentQuestionIndex);
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }

    function showNextQuestion() {
        saveAnswer(currentQuestionIndex);

        if (currentQuestionIndex < currentTest.questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            submitTest();
        }
    }

    function saveAnswer(index) {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        userAnswers[index] = selectedOption ? parseInt(selectedOption.value) : null;
    }

    function submitTest() {
        clearInterval(timerInterval);

        // Calculate score
        let correctAnswers = 0;
        const results = [];

        currentTest.questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer !== null && question.options[userAnswer].correct;

            if (isCorrect) correctAnswers++;

            results.push({
                question: question.text,
                correctAnswer: question.options.find(opt => opt.correct).text,
                userAnswer: userAnswer !== null ? question.options[userAnswer].text : 'Not answered',
                isCorrect: isCorrect
            });
        });

        const score = Math.round((correctAnswers / currentTest.questions.length) * 100);
        const passed = score >= currentTest.passingScore;

        // Save submission
        const submission = {
            id: Date.now().toString(),
            testId: currentTest.id,
            userId: currentUser.id,
            userName: currentUser.name,
            userEmail: currentUser.email,
            date: new Date().toISOString(),
            score: score,
            passed: passed,
            answers: userAnswers
        };

        saveSubmission(submission);

        // Update test with submission
        const test = getTest(currentTest.id);
        test.submissions = test.submissions || [];
        test.submissions.push({
            userId: currentUser.id,
            userName: currentUser.name,
            score: score,
            date: new Date().toISOString()
        });
        saveTest(test);

        // Show results
        showTestResults(submission, results);
    }

    function showTestResults(submission, results) {
        testModal.classList.remove('active');

        // Update results display
        document.getElementById('resultScoreCircle').textContent = `${submission.score}%`;
        document.getElementById('resultStatusText').textContent = submission.passed ? 'Passed' : 'Failed';
        document.getElementById('resultStatusText').className = submission.passed ? 'passed' : 'failed';

        document.getElementById('resultsQuestionCount').textContent = results.length;
        document.getElementById('resultsCorrectCount').textContent = results.filter(r => r.isCorrect).length;

        const timeSpent = (currentTest.duration * 60) - timeLeft;
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        document.getElementById('resultsTimeSpent').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('resultsPassingScore').textContent = `${currentTest.passingScore}%`;

        // Render question review
        const resultsContainer = document.getElementById('questionsReview');
        resultsContainer.innerHTML = '';

        results.forEach((result, i) => {
            const resultEl = document.createElement('div');
            resultEl.className = 'question-review';
            resultEl.innerHTML = `
                <div class="question-text"><strong>Q${i + 1}:</strong> ${result.question}</div>
                <div class="correct-answer">Correct answer: ${result.correctAnswer}</div>
                <div class="user-answer ${result.isCorrect ? 'correct' : 'incorrect'}">
                    Your answer: ${result.userAnswer}
                </div>
            `;
            resultsContainer.appendChild(resultEl);
        });

        testResultsModal.classList.add('active');

        // Update the UI
        renderAvailableTests();
        renderCompletedTests();
    }

    function viewTestResults(submissionId) {
        const submission = getSubmission(submissionId);
        if (!submission) return;

        const test = getTest(submission.testId);
        if (!test) return;

        // Reconstruct results
        const results = [];
        test.questions.forEach((question, index) => {
            const userAnswerIndex = submission.answers[index];
            results.push({
                question: question.text,
                correctAnswer: question.options.find(opt => opt.correct).text,
                userAnswer: userAnswerIndex !== null ? question.options[userAnswerIndex].text : 'Not answered',
                isCorrect: userAnswerIndex !== null && question.options[userAnswerIndex].correct
            });
        });

        // Show results
        showTestResults(submission, results);
    }

    // Data functions
    function getTests() {
        const tests = JSON.parse(localStorage.getItem('tests')) || [];
        const now = new Date();
        // Update status for tests that are past due
        tests.forEach(test => {
            if (test.dueDate && new Date(test.dueDate) < now && test.status !== 'expired') {
                test.status = 'expired';
            }
        });
        localStorage.setItem('tests', JSON.stringify(tests));
        return tests;
    }

    function getTest(id) {
        return getTests().find(t => t.id === id);
    }

    function saveTest(test) {
        const tests = getTests();
        const index = tests.findIndex(t => t.id === test.id);

        if (index >= 0) {
            tests[index] = test;
        } else {
            tests.push(test);
        }

        localStorage.setItem('tests', JSON.stringify(tests));
    }

    function getSubmissions() {
        return JSON.parse(localStorage.getItem('testSubmissions')) || [];
    }

    function getSubmission(id) {
        return getSubmissions().find(s => s.id === id);
    }

    function saveSubmission(submission) {
        const submissions = getSubmissions();
        submissions.push(submission);
        localStorage.setItem('testSubmissions', JSON.stringify(submissions));
    }

    function getCourse(id) {
        const courses = [
            { id: '1', title: 'CRT Masterclass', category: 'CRT' },
            { id: '2', title: 'Psychology of Trading', category: 'Psychology' }
        ];
        return courses.find(c => c.id === id);
    }

    function closeAllModals() {
        testModal.classList.remove('active');
        testResultsModal.classList.remove('active');
    }
});