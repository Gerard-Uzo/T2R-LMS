document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addTestBtn = document.getElementById('addTestBtn');
    const addTestModal = document.getElementById('addTestModal');
    const addQuestionModal = document.getElementById('addQuestionModal');
    const testsTableBody = document.getElementById('testsTableBody');
    const addTestForm = document.getElementById('addTestForm');
    const addQuestionForm = document.getElementById('addQuestionForm');
    const testCourseSelect = document.getElementById('testCourse');
    const questionsList = document.getElementById('questionsList');
    const optionsContainer = document.getElementById('optionsContainer');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteTestModal = document.getElementById('deleteTestModal');

    // State
    let currentTestId = null;
    let tests = JSON.parse(localStorage.getItem('tests')) || [];
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const courses = [
        { id: '1', title: 'CRT Masterclass', category: 'CRT' },
        { id: '2', title: 'Psychology of Trading', category: 'Psychology' }
    ];

    // Initialize
    init();

    function init() {
        setupEventListeners();
        loadCourses();
        checkTestDueDates();
        renderTestsTable();
    }

    function setupEventListeners() {
        // Test Management
        addTestBtn.addEventListener('click', showAddTestModal);
        addTestForm.addEventListener('submit', handleTestSubmit);
        confirmDeleteBtn.addEventListener('click', confirmDeleteTest);

        // Question Management
        addQuestionForm.addEventListener('submit', handleQuestionSubmit);
        addOptionBtn.addEventListener('click', addOptionField);

        // Close modals
        document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    }

    function loadCourses() {
        testCourseSelect.innerHTML = '<option value="">Select Course</option>';
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.title;
            testCourseSelect.appendChild(option);
        });
    }

    function checkTestDueDates() {
        const now = new Date();
        tests.forEach(test => {
            if (test.dueDate && new Date(test.dueDate) < now) {
                test.status = 'expired';
            }
        });
        saveTests();
    }

    function renderTestsTable() {
        testsTableBody.innerHTML = '';

        tests.forEach(test => {
            const course = courses.find(c => c.id === test.courseId) || {};
            const submissionsCount = test.submissions?.length || 0;
            const dueDate = test.dueDate ? new Date(test.dueDate).toLocaleString() : 'No due date';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${test.title}</td>
                <td>${course.title || 'Unknown'}</td>
                <td>${test.questions?.length || 0}</td>
                <td>${test.duration} mins</td>
                <td>${dueDate}</td>
                <td><span class="badge ${getStatusBadgeClass(test.status)}">${test.status}</span></td>
                <td class="submissions-cell" data-testid="${test.id}" style="cursor: pointer;">${submissionsCount}</td>
                <td>
                    <button class="btn-icon edit-btn" data-id="${test.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon questions-btn" data-id="${test.id}"><i class="fas fa-question-circle"></i></button>
                    <button class="btn-icon results-btn" data-id="${test.id}"><i class="fas fa-chart-bar"></i></button>
                    <button class="btn-icon delete-btn" data-id="${test.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            testsTableBody.appendChild(row);
        });

        // Add event listeners to table buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => editTest(e.target.closest('button').dataset.id));
        });

        document.querySelectorAll('.questions-btn').forEach(btn => {
            btn.addEventListener('click', (e) => manageQuestions(e.target.closest('button').dataset.id));
        });

        document.querySelectorAll('.results-btn').forEach(btn => {
            btn.addEventListener('click', (e) => viewResults(e.target.closest('button').dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => showDeleteConfirmation(e.target.closest('button').dataset.id));
        });

        // Add click event to submissions count
        document.querySelectorAll('.submissions-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                viewResults(e.target.closest('td').dataset.testid);
            });
        });
    }

    function getStatusBadgeClass(status) {
        switch(status) {
            case 'active': return 'badge-green';
            case 'draft': return 'badge-yellow';
            case 'expired': return 'badge-red';
            default: return 'badge-yellow';
        }
    }

    function showDeleteConfirmation(testId) {
        currentTestId = testId;
        deleteTestModal.classList.add('active');
    }

    function confirmDeleteTest() {
        tests = tests.filter(test => test.id !== currentTestId);
        saveTests();
        deleteTestModal.classList.remove('active');
        renderTestsTable();
    }

    function showAddTestModal() {
        addTestForm.reset();
        document.getElementById('testDueDate').value = '';
        document.getElementById('testStatus').value = 'active';
        currentTestId = null;
        addTestModal.classList.add('active');
    }

    function handleTestSubmit(e) {
        e.preventDefault();

        const testData = {
            id: currentTestId || Date.now().toString(),
            title: document.getElementById('testTitle').value,
            courseId: document.getElementById('testCourse').value,
            duration: parseInt(document.getElementById('testDuration').value),
            passingScore: parseInt(document.getElementById('testPassingScore').value),
            dueDate: document.getElementById('testDueDate').value,
            status: document.getElementById('testStatus').value,
            description: document.getElementById('testDescription').value,
            questions: currentTestId ? getTest(currentTestId).questions || [] : [],
            submissions: currentTestId ? getTest(currentTestId).submissions || [] : []
        };

        if (currentTestId) {
            // Update existing test
            const index = tests.findIndex(t => t.id === currentTestId);
            if (index >= 0) {
                tests[index] = testData;
            }
        } else {
            // Add new test
            tests.push(testData);
        }

        saveTests();
        addTestModal.classList.remove('active');
        renderTestsTable();
    }

    function manageQuestions(testId) {
        currentTestId = testId;
        const test = getTest(testId);

        addQuestionForm.reset();
        optionsContainer.innerHTML = `
            <div class="option-item">
                <input type="radio" name="correctOption" value="0" class="correct-option" required>
                <input type="text" class="option-text" placeholder="Option 1" required>
            </div>
            <div class="option-item">
                <input type="radio" name="correctOption" value="1">
                <input type="text" class="option-text" placeholder="Option 2" required>
            </div>
        `;

        renderQuestionsList(test.questions || []);
        addQuestionModal.classList.add('active');
    }

    function renderQuestionsList(questions) {
        questionsList.innerHTML = '';

        questions.forEach((question, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question-item';
            questionEl.innerHTML = `
                <div class="question-header">
                    <span><strong>Q${index + 1}:</strong> ${question.text}</span>
                    <button class="btn-icon delete-question" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
                <div class="question-options">
                    ${question.options.map((opt, i) => `
                        <div class="option ${opt.correct ? 'correct' : ''}">
                            ${String.fromCharCode(65 + i)}. ${opt.text}
                        </div>
                    `).join('')}
                </div>
            `;
            questionsList.appendChild(questionEl);
        });

        // Add delete event listeners
        document.querySelectorAll('.delete-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const test = getTest(currentTestId);
                test.questions.splice(parseInt(e.target.closest('button').dataset.index), 1);
                saveTests();
                renderQuestionsList(test.questions);
            });
        });
    }

    function addOptionField() {
        const optionCount = optionsContainer.querySelectorAll('.option-item').length;
        if (optionCount >= 6) return;

        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <input type="radio" name="correctOption" value="${optionCount}">
            <input type="text" class="option-text" placeholder="Option ${optionCount + 1}">
        `;
        optionsContainer.appendChild(optionItem);
    }

    function handleQuestionSubmit(e) {
        e.preventDefault();

        const test = getTest(currentTestId);
        if (!test) return;

        const questionText = document.getElementById('questionText').value;
        const optionItems = optionsContainer.querySelectorAll('.option-item');

        const options = Array.from(optionItems).map((item, index) => {
            const text = item.querySelector('.option-text').value;
            const isCorrect = item.querySelector('input[type="radio"]').checked;

            return {
                text: text,
                correct: isCorrect
            };
        }).filter(opt => opt.text.trim() !== '');

        if (options.length < 2) {
            alert('Please add at least 2 options');
            return;
        }

        if (!options.some(opt => opt.correct)) {
            alert('Please mark the correct answer');
            return;
        }

        const newQuestion = {
            id: Date.now().toString(),
            text: questionText,
            type: 'multiple_choice',
            options: options,
            points: 1
        };

        test.questions = test.questions || [];
        test.questions.push(newQuestion);
        saveTests();

        addQuestionForm.reset();
        renderQuestionsList(test.questions);
    }

    function viewResults(testId) {
        const test = getTest(testId);
        if (!test) return;

        document.getElementById('resultsTestTitle').textContent = test.title;
        const resultsBody = document.getElementById('studentResultsBody');
        resultsBody.innerHTML = '';

        test.submissions.forEach(sub => {
            const student = students.find(s => s.id === sub.userId) || {};
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name || 'Unknown Student'}</td>
                <td>${student.email || 'No email'}</td>
                <td>${sub.score}%</td>
                <td><span class="badge ${sub.score >= test.passingScore ? 'badge-green' : 'badge-red'}">
                    ${sub.score >= test.passingScore ? 'Passed' : 'Failed'}
                </span></td>
                <td>${new Date(sub.date).toLocaleString()}</td>
                <td>
                    <button class="btn-icon view-details-btn" data-user="${sub.userId}" data-test="${testId}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            resultsBody.appendChild(row);
        });

        document.getElementById('studentResultsModal').classList.add('active');
    }

    function editTest(testId) {
        const test = getTest(testId);
        if (!test) return;

        document.getElementById('testTitle').value = test.title;
        document.getElementById('testCourse').value = test.courseId;
        document.getElementById('testDuration').value = test.duration;
        document.getElementById('testPassingScore').value = test.passingScore;
        document.getElementById('testDescription').value = test.description || '';
        document.getElementById('testStatus').value = test.status || 'active';

        if (test.dueDate) {
            const dueDate = new Date(test.dueDate);
            const formattedDate = dueDate.toISOString().slice(0, 16);
            document.getElementById('testDueDate').value = formattedDate;
        }

        currentTestId = testId;
        addTestModal.classList.add('active');
    }

    function getTest(id) {
        return tests.find(t => t.id === id);
    }

    function saveTests() {
        localStorage.setItem('tests', JSON.stringify(tests));
    }

    function closeAllModals() {
        addTestModal.classList.remove('active');
        addQuestionModal.classList.remove('active');
        document.getElementById('studentResultsModal').classList.remove('active');
        deleteTestModal.classList.remove('active');
    }
});                                                                                