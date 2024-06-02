
document.addEventListener('DOMContentLoaded', () => {
    const categories = ['All Questions', 'General Knowledge', 'Science', 'History', 'Sports'];
    const categoryDropdown = document.getElementById('category-dropdown');
    const searchBar = document.getElementById('search-bar');
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const quizContainer = document.getElementById('quiz-container');
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    
    let currentCategory = '';
    let currentDifficulty = '';
    let timer =0;
    let elapsedTime = 0;
    let correctAnswers = 0;
    let totalQuestions = 0;
    let answeredQuestions = 0;

     
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase().replace(/ /g, '-');
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });

 
    categoryDropdown.addEventListener('change', () => {
        currentCategory = categoryDropdown.value;
        fetchQuizzes(searchBar.value.toLowerCase(), currentDifficulty, currentCategory);
    });

 
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        fetchQuizzes(query, currentDifficulty, currentCategory);
    });

 
    voiceSearchBtn.addEventListener('click', () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onresult = event => {
            const query = event.results[0][0].transcript;
            searchBar.value = query;
            fetchQuizzes(query, currentDifficulty, currentCategory);
        };
        recognition.start();
    });

   
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentDifficulty = button.dataset.difficulty;
            fetchQuizzes(searchBar.value.toLowerCase(), currentDifficulty, currentCategory);
        });
    });
 
    function fetchQuizzes(query = '', difficulty = '', category = '') {
        
        const quizzes = [
            { category: 'general-knowledge', question: 'What is the capital of France?', difficulty: 'easy', answers: ['Paris', 'Rome', 'Madrid', 'Berlin'], correct: 0 },
            { category: 'science', question: 'What is the chemical symbol for water?', difficulty: 'easy', answers: ['O2', 'H2O', 'CO2', 'N2'], correct: 1 },
            { category: 'history', question: 'Who wrote "To Kill a Mockingbird"?', difficulty: 'medium', answers: ['Harper Lee', 'Mark Twain', 'Ernest Hemingway', 'F. Scott Fitzgerald'], correct: 0 },
            { category: 'general-knowledge', question: 'What is the square root of 144?', difficulty: 'medium', answers: ['10', '11', '12', '13'], correct: 2 },
            { category: 'science', question: 'What is the theory of relativity?', difficulty: 'hard', answers: ['Quantum Mechanics', 'String Theory', 'Relativity Theory', 'Big Bang Theory'], correct: 2 },
            { category: 'science', question: 'What is quantum mechanics?', difficulty: 'hard', answers: ['Study of galaxies', 'Study of cells', 'Study of atoms and particles', 'Study of ecosystems'], correct: 2 }
        ];

        const filteredQuizzes = quizzes
            .filter(quiz => (!query || quiz.question.toLowerCase().includes(query)))
            .filter(quiz => (!difficulty || quiz.difficulty === difficulty))
            .filter(quiz => (category === 'all-questions' || !category || quiz.category === category));

        displayQuizzes(filteredQuizzes);
    }

     
    function displayQuizzes(quizzes) {
        quizContainer.innerHTML = '';
        if (quizzes.length === 0) {
            quizContainer.innerHTML = 'No questions available.';
            return;
        }
        totalQuestions = quizzes.length;
        answeredQuestions = 0;
        correctAnswers = 0;  
        quizzes.forEach((quiz, index) => {
            const quizElement = document.createElement('div');
            quizElement.classList.add('quiz');
            quizElement.innerHTML = `
                <p>${quiz.question}</p>
                ${quiz.answers.map((answer, i) => `<button onclick="checkAnswer(${index}, ${i})">${answer}</button>`).join('')}
            `;
            quizContainer.appendChild(quizElement);
        });
        startTimer();
    }

    
    function startTimer() {
        elapsedTime = 0;
        clearInterval(timer);
        timer = setInterval(() => {
            elapsedTime++;
            timerElement.innerText = `Time: ${elapsedTime}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    
    window.checkAnswer = function (quizIndex, selectedAnswer) {
        stopTimer();
        const quizzes = quizContainer.getElementsByClassName('quiz');
        const quiz = quizzes[quizIndex];
        const buttons = quiz.getElementsByTagName('button');
        const quizData = fetchQuizzesData()[quizIndex];
        const correctAnswer = quizData.correct;

        if (selectedAnswer === correctAnswer) {
            correctAnswers++;
            buttons[selectedAnswer].style.backgroundColor = 'green';
        } else {
            buttons[selectedAnswer].style.backgroundColor = 'red';
            buttons[correctAnswer].style.backgroundColor = 'green';
        }

        answeredQuestions++;
        updateProgressBar();

        setTimeout(() => {
            quiz.remove();
            if (answeredQuestions === totalQuestions) {
                showFinalProgress();
            }
        }, 1000);
    };

    
    window.appendCalcInput = function(value) {
        document.getElementById('calc-input').value += value;
    };

    window.clearCalcInput = function() {
        document.getElementById('calc-input').value = '';
    };

    window.calculateResult = function() {
        try {
            document.getElementById('calc-input').value = eval(document.getElementById('calc-input').value);
        } catch {
            document.getElementById('calc-input').value = 'Error';
        }
    };

    
    fetchQuizzes();
});


