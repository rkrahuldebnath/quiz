// All quiz questions with category, board, class, mainLevel, and subLevel properties
    const allQuizData = [
      // School English - TBSE - Class 8
      { question: "TBSE Class 8 - Q1: What is a noun?", a: "An action", b: "A person, place, or thing", c: "A description", d: "A feeling", correct: "b", category: "SchoolEnglish", board: "TBSE", class: 8, mainLevel: "Beginner", subLevel: 1 },
      { question: "TBSE Class 8 - Q2: Choose the verb: 'The bird sings beautifully.'", a: "bird", b: "sings", c: "beautifully", d: "the", correct: "b", category: "SchoolEnglish", board: "TBSE", class: 8, mainLevel: "Beginner", subLevel: 1 },
      { question: "TBSE Class 8 - Q3: Fill in the blank: 'She ___ to school every day.'", a: "go", b: "goes", c: "going", d: "went", correct: "b", category: "SchoolEnglish", board: "TBSE", class: 8, mainLevel: "Beginner", subLevel: 1 },

      // School English - TBSE - Class 9
      { question: "TBSE Class 9 - Q1: Identify the adjective: 'The big dog barked loudly.'", a: "dog", b: "barked", c: "big", d: "loudly", correct: "c", category: "SchoolEnglish", board: "TBSE", class: 9, mainLevel: "Intermediate", subLevel: 1 },
      { question: "TBSE Class 9 - Q2: Correct the sentence: 'He don't like apples.'", a: "He doesn't like apples.", b: "He not like apples.", c: "He no like apples.", d: "He isn't like apples.", correct: "a", category: "SchoolEnglish", board: "TBSE", class: 9, mainLevel: "Intermediate", subLevel: 1 },

      // School English - CBSE - Class 8
      { question: "CBSE Class 8 - Q1: What is an adjective?", a: "Describes an action", b: "Describes a noun or pronoun", c: "Connects words", d: "Shows emotion", correct: "b", category: "SchoolEnglish", board: "CBSE", class: 8, mainLevel: "Beginner", subLevel: 1 },
      { question: "CBSE Class 8 - Q2: Choose the adverb: 'She walks slowly.'", a: "She", b: "walks", c: "slowly", d: "the", correct: "c", category: "SchoolEnglish", board: "CBSE", class: 8, mainLevel: "Beginner", subLevel: 1 },

      // Job English - Beginner - Level 1
      { question: "Job English - Q1: What does 'ASAP' mean?", a: "As Simple As Possible", b: "As Soon As Possible", c: "Always Send All Papers", d: "Ask Someone About Projects", correct: "b", category: "JobEnglish", board: null, class: null, mainLevel: "Beginner", subLevel: 1 },
      { question: "Job English - Q2: Choose the formal greeting:", a: "Hey there,", b: "Yo,", c: "Dear Mr. Sharma,", d: "What's up?", correct: "c", category: "JobEnglish", board: null, class: null, mainLevel: "Beginner", subLevel: 1 },
      { question: "Job English - Q3: Which is suitable for a resume?", a: "Expert in chilling", b: "Proficient in Microsoft Office", c: "Good at talking", d: "Loves to sleep", correct: "b", category: "JobEnglish", board: null, class: null, mainLevel: "Beginner", subLevel: 1 },
    ];

    // Define the exact order of main and sub-levels for each category, board, and class combination
    // This allows flexible progression for different curricula/exam types
    const LEVEL_ORDER_MAP = {
        "SchoolEnglish": {
            "TBSE": {
                8: [{ main: "Beginner", sub: 1 }, { main: "Beginner", sub: 2 }], // Adding a second sub-level for demo
                9: [{ main: "Intermediate", sub: 1 }],
                10: [{ main: "Intermediate", sub: 2 }],
                11: [{ main: "Advanced", sub: 1 }],
                12: [{ main: "Advanced", sub: 2 }]
            },
            "CBSE": {
                8: [{ main: "Beginner", sub: 1 }, { main: "Beginner", sub: 2 }], // Adding a second sub-level for demo
                9: [{ main: "Intermediate", sub: 1 }],
                10: [{ main: "Intermediate", sub: 2 }],
                11: [{ main: "Advanced", sub: 1 }],
                12: [{ main: "Advanced", sub: 2 }]
            }
        },
        "JobEnglish": {
            "default": { // Use 'default' as key for categories without board/class
                null: [ // Use null for class if not applicable
                    { main: "Beginner", sub: 1 },
                    { main: "Intermediate", sub: 1 },
                    { main: "Advanced", sub: 1 }
                ]
            }
        }
    };

    // Helper to generate an array of all possible ordered level keys
    // Used for consistent indexing in unlocking logic
    function generateAllLevelKeys() {
        const allKeys = [];
        for (const category in LEVEL_ORDER_MAP) {
            for (const board in LEVEL_ORDER_MAP[category]) {
                for (const className in LEVEL_ORDER_MAP[category][board]) {
                    LEVEL_ORDER_MAP[category][board][className].forEach(levelObj => {
                        const key = `${category}-${board !== 'default' ? board : 'null'}-${className !== 'null' ? className : 'null'}-${levelObj.main}-${levelObj.sub}`;
                        allKeys.push(key);
                    });
                }
            }
        }
        return allKeys;
    }
    const ALL_GLOBAL_LEVEL_KEYS = generateAllLevelKeys();
    console.log("All Global Level Keys:", ALL_GLOBAL_LEVEL_KEYS);

    // Load unlocked levels from local storage
    // Stored as an array of strings like ["SchoolEnglish-TBSE-8-Beginner-1"]
    let unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [];
    let currentCategory = ""; // Stores the currently selected category (e.g., "SchoolEnglish", "JobEnglish")
    let currentBoard = null; // Stores the currently selected board (e.g., "TBSE", "CBSE", or null)
    let currentClass = null; // Stores the currently selected class (e.g., 8, 9, or null)
    let currentLevelKey = ""; // Tracks the currently active level (e.g., "Beginner-1")

    let questions = []; // This will hold questions for the selected category/board/class/level
    let currentQuestion = 0;
    let score = 0;
    let timeLeft = 60;
    let timer;

    // DOM elements
    const categorySelectionDiv = document.getElementById("category-selection");
    const btnSchoolTBSE = document.getElementById("btn-school-tbse");
    const btnSchoolCBSE = document.getElementById("btn-school-cbse");
    const btnJobEnglish = document.getElementById("btn-job-english");
    const classSelectionDiv = document.getElementById("class-selection");
    const classSelect = document.getElementById("class-select");
    const startClassQuizBtn = document.getElementById("start-class-quiz-btn");
    const levelSelectionDiv = document.getElementById("level-selection");
    const difficultyLevelSelect = document.getElementById("difficulty-level");
    const startQuizBtn = document.getElementById("start-quiz-btn");
    const quizContainer = document.getElementById("quiz-container");
    const timerEl = document.getElementById("timer");
    const questionBox = document.getElementById("question-box");
    const nextBtn = document.getElementById("next-btn");
    const resultBox = document.getElementById("result");
    const playAgainBtn = document.getElementById("play-again-btn");

    /**
     * Initializes unlocked levels if none are found in local storage.
     * Ensures at least the first level of each defined category/path is unlocked by default.
     */
    function initializeUnlockedLevels() {
        if (unlockedLevels.length === 0) {
            // Unlock the very first level of TBSE Class 8 and Job English by default
            if (LEVEL_ORDER_MAP.SchoolEnglish.TBSE[8] && LEVEL_ORDER_MAP.SchoolEnglish.TBSE[8].length > 0) {
                const firstSchoolTBSELevel = LEVEL_ORDER_MAP.SchoolEnglish.TBSE[8][0];
                unlockedLevels.push(`SchoolEnglish-TBSE-8-${firstSchoolTBSELevel.main}-${firstSchoolTBSELevel.sub}`);
            }
             if (LEVEL_ORDER_MAP.SchoolEnglish.CBSE[8] && LEVEL_ORDER_MAP.SchoolEnglish.CBSE[8].length > 0) {
                const firstSchoolCBSELevel = LEVEL_ORDER_MAP.SchoolEnglish.CBSE[8][0];
                unlockedLevels.push(`SchoolEnglish-CBSE-8-${firstSchoolCBSELevel.main}-${firstSchoolCBSELevel.sub}`);
            }
            if (LEVEL_ORDER_MAP.JobEnglish.default[null] && LEVEL_ORDER_MAP.JobEnglish.default[null].length > 0) {
                const firstJobEnglishLevel = LEVEL_ORDER_MAP.JobEnglish.default[null][0];
                unlockedLevels.push(`JobEnglish-null-null-${firstJobEnglishLevel.main}-${firstJobEnglishLevel.sub}`);
            }
            saveUnlockedLevels();
        }
        console.log("Initial unlocked levels:", unlockedLevels);
    }

    /**
     * Populates the class selection dropdown based on the current board.
     */
    function populateClassSelection() {
        classSelect.innerHTML = '';
        const classes = [8, 9, 10, 11, 12]; // Assuming classes 8-12 are always available for selection

        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = `Class ${cls}`;
            // Optional: disable classes if no questions exist for them yet, but user wants to select class first.
            // For now, allow selection and handle "no questions" at quiz start.
            classSelect.appendChild(option);
        });
        // Select Class 8 by default
        classSelect.value = 8;
    }

    /**
     * Updates the options in the difficulty level dropdown based on the currently selected
     * category, board, and class.
     */
    function updateLevelSelection() {
        console.log(`Updating level selection for: ${currentCategory}, ${currentBoard}, Class ${currentClass}.`);
        difficultyLevelSelect.innerHTML = ''; // Clear existing options

        const levelsForPath = LEVEL_ORDER_MAP[currentCategory]?.[currentBoard || 'default']?.[currentClass || null] || [];

        levelsForPath.forEach(levelObj => {
            const levelKey = `${currentCategory}-${currentBoard || 'null'}-${currentClass || 'null'}-${levelObj.main}-${levelObj.sub}`;
            const option = document.createElement('option');
            option.value = levelKey;
            option.textContent = `${levelObj.main} - Level ${levelObj.sub}`;

            if (!unlockedLevels.includes(levelKey)) {
                option.disabled = true;
                option.textContent += ' (Locked)';
            }
            difficultyLevelSelect.appendChild(option);
        });

        // Try to select the last played level if it belongs to the current path and is unlocked
        if (currentLevelKey.startsWith(`${currentCategory}-${currentBoard || 'null'}-${currentClass || 'null'}`) && unlockedLevels.includes(currentLevelKey)) {
            difficultyLevelSelect.value = currentLevelKey;
        } else if (levelsForPath.length > 0) {
            // Fallback: select the first unlocked level in the current path
            const firstUnlockedInCurrentPath = unlockedLevels.find(key =>
                key.startsWith(`${currentCategory}-${currentBoard || 'null'}-${currentClass || 'null'}`)
            );
            if (firstUnlockedInCurrentPath) {
                difficultyLevelSelect.value = firstUnlockedInCurrentPath;
            } else {
                // If no levels are unlocked for this specific path, ensure the first one is selectable
                const firstLevelKeyForPath = `${currentCategory}-${currentBoard || 'null'}-${currentClass || 'null'}-${levelsForPath[0].main}-${levelsForPath[0].sub}`;
                if (unlockedLevels.includes(firstLevelKeyForPath)) { // Check if it's explicitly unlocked
                    difficultyLevelSelect.value = firstLevelKeyForPath;
                } else if (difficultyLevelSelect.options.length > 0 && !difficultyLevelSelect.options[0].disabled) {
                    difficultyLevelSelect.value = difficultyLevelSelect.options[0].value;
                }
            }
        }
    }

    /**
     * Saves the current state of unlocked levels to local storage.
     */
    function saveUnlockedLevels() {
        try {
            localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
            console.log("Unlocked levels saved to local storage:", unlockedLevels);
        } catch (e) {
            console.error("Error saving to local storage:", e);
        }
    }

    /**
     * Unlocks the next level in the progression for the current category, board, and class.
     * Unlocking occurs upon completion of any level.
     * @param {string} completedLevelKey - The full key of the level that was just completed.
     * @returns {boolean} True if a new level was unlocked, false otherwise.
     */
    function unlockNextLevel(completedLevelKey) {
        const currentIndex = ALL_GLOBAL_LEVEL_KEYS.indexOf(completedLevelKey);

        if (currentIndex !== -1 && currentIndex < ALL_GLOBAL_LEVEL_KEYS.length - 1) {
            const nextLevelKey = ALL_GLOBAL_LEVEL_KEYS[currentIndex + 1];
            // Only unlock if the next level is in the same category, board, and class progression
            // or if it's the natural next step across class/board/category boundaries
            const [compCat, compBoard, compClass, compMain, compSub] = completedLevelKey.split('-');
            const [nextCat, nextBoard, nextClass, nextMain, nextSub] = nextLevelKey.split('-');

            // Simple check: if the category is the same, and if board/class are either same or next in sequence
            if (nextCat === compCat &&
                ((nextBoard === compBoard && nextClass === compClass) || // same board/class
                 (nextBoard === compBoard && parseInt(nextClass) === parseInt(compClass) + 1) || // next class in same board
                 (nextBoard !== compBoard && nextBoard !== 'null' && (nextBoard === 'TBSE' || nextBoard === 'CBSE')) || // transition to new board (if applicable, e.g. for School English)
                 (nextCat !== compCat) // new category (should be handled by category selection, but safe check)
                ))
             {
                if (!unlockedLevels.includes(nextLevelKey)) {
                    unlockedLevels.push(nextLevelKey);
                    saveUnlockedLevels();
                    console.log(`Level "${nextLevelKey}" unlocked!`);
                    return true;
                }
            }
        }
        return false; // Indicate no level was unlocked
    }

    /**
     * Filters the quiz data based on the selected category, board, class, mainLevel, and subLevel.
     * Maps the filtered data to a consistent structure for quiz presentation.
     * @param {string} fullLevelKey - The combined level key (e.g., "SchoolEnglish-TBSE-8-Beginner-1").
     */
    function filterQuestionsByLevel(fullLevelKey) {
        const [category, board, className, mainLevel, subLevelStr] = fullLevelKey.split('-');
        const subLevel = parseInt(subLevelStr);
        const classNum = className !== 'null' ? parseInt(className) : null;
        const boardVal = board !== 'null' ? board : null;

        const filteredQuizData = allQuizData.filter(q =>
            q.category === category &&
            (q.board === boardVal || (q.board === null && boardVal === null)) &&
            (q.class === classNum || (q.class === null && classNum === null)) &&
            q.mainLevel === mainLevel &&
            q.subLevel === subLevel
        );

        questions = filteredQuizData.map(q => {
            const options = [q.a, q.b, q.c, q.d];
            let answerIndex;
            switch (q.correct) {
                case 'a': answerIndex = 0; break;
                case 'b': answerIndex = 1; break;
                case 'c': answerIndex = 2; break;
                case 'd': answerIndex = 3; break;
            }
            return {
                question: q.question,
                options: options,
                answer: answerIndex
            };
        });
        console.log(`Questions for "${fullLevelKey}":`, questions);
    }

    /**
     * Displays the home page with category selection.
     */
    function showHomePage() {
        categorySelectionDiv.classList.remove("hidden");
        classSelectionDiv.classList.add("hidden"); // Ensure class selection is hidden
        levelSelectionDiv.classList.add("hidden");
        quizContainer.classList.add("hidden");
        resultBox.classList.add("hidden");
        playAgainBtn.classList.add("hidden");
    }

    /**
     * Displays the class selection page for School English.
     */
    function showClassSelectionPage() {
        categorySelectionDiv.classList.add("hidden");
        classSelectionDiv.classList.remove("hidden");
        levelSelectionDiv.classList.add("hidden");
        quizContainer.classList.add("hidden");
        resultBox.classList.add("hidden");
        playAgainBtn.classList.add("hidden");
        populateClassSelection(); // Populate class dropdown
    }

    /**
     * Displays the level selection page for the current category/board/class.
     */
    function showLevelSelectionPage() {
        categorySelectionDiv.classList.add("hidden");
        classSelectionDiv.classList.add("hidden");
        levelSelectionDiv.classList.remove("hidden");
        quizContainer.classList.add("hidden");
        resultBox.classList.add("hidden");
        playAgainBtn.classList.add("hidden");
        updateLevelSelection(); // Refresh dropdown options
    }

    /**
     * Initializes a new quiz session for the selected level within the current path.
     */
    function startQuiz() {
      currentLevelKey = difficultyLevelSelect.value; // Store the selected full level key
      filterQuestionsByLevel(currentLevelKey);

      if (questions.length === 0) {
        resultBox.textContent = `No questions available for ${difficultyLevelSelect.options[difficultyLevelSelect.selectedIndex].textContent}. Please select another level or category.`;
        resultBox.classList.remove('hidden');
        quizContainer.classList.add('hidden'); // Hide quiz container if no questions
        return;
      }

      currentQuestion = 0;
      score = 0;
      levelSelectionDiv.classList.add("hidden"); // Hide level selection
      quizContainer.classList.remove("hidden"); // Show quiz container
      resultBox.classList.add("hidden"); // Hide result
      playAgainBtn.classList.add("hidden"); // Hide play again button

      showQuestion(currentQuestion);
      startTimer();
      nextBtn.classList.add("hidden"); // Hide next button initially
    }

    /**
     * Starts or restarts the timer for the current question.
     * Clears any previous timer to prevent multiple timers running simultaneously.
     */
    function startTimer() {
      timeLeft = 60; // Reset time for each new question
      timerEl.textContent = `Time Left: ${timeLeft}s`;
      clearInterval(timer); // Crucial: Clear any existing timer before starting a new one
      timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer); // Stop timer when time runs out
          disableOptions(); // Disable options when time is up
          nextBtn.classList.remove("hidden"); // Show the Next button
        }
      }, 1000); // Update every second
    }

    /**
     * Displays the question at the given index.
     * Dynamically generates HTML for the question and its options.
     * @param {number} index - The index of the question to display.
     */
    function showQuestion(index) {
      const q = questions[index];
      const optionLabels = ['A.', 'B.', 'C.', 'D.'];
      questionBox.innerHTML = `
        <h2 class="text-xl font-semibold mb-4">${index + 1}. ${q.question}</h2>
        <ul class="space-y-2">
          ${q.options.map((opt, i) => `
            <li>
              <button onclick="checkAnswer(${i})" class="w-full text-left bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center gap-3">
                <span class="font-bold text-lg">${optionLabels[i]}</span> <span>${opt}</span>
              </button>
            </li>`).join("")}
        </ul>
      `;
    }

    /**
     * Checks the selected answer against the correct answer.
     * Stops the timer, disables all options, and visually indicates correct/incorrect answers.
     * Updates the score if the answer is correct.
     * @param {number} selected - The index of the option selected by the user.
     */
    window.checkAnswer = function(selected) { // Made global for onclick in HTML
      clearInterval(timer); // Stop the timer as soon as an answer is selected
      const correct = questions[currentQuestion].answer; // Get the index of the correct answer
      const buttons = questionBox.querySelectorAll("button"); // Get all option buttons

      buttons.forEach((btn, i) => {
        btn.disabled = true; // Disable all buttons after an answer is chosen
        if (i === correct) {
          btn.classList.add("bg-green-300"); // Highlight correct answer in green
        }
        if (i === selected && selected !== correct) {
          btn.classList.add("bg-red-300"); // Highlight incorrect selected answer in red
        }
      });

      // Do NOT show the correct answer text below the options here

      if (selected === correct) {
        score++; // Increment score if the selected answer is correct
      }
      nextBtn.classList.remove("hidden"); // Show the Next button

      // Track user's answer for summary
      userAnswers[currentQuestion] = selected;
    }

    /**
     * Disables all options for the current question and highlights the correct answer.
     * Used when the timer runs out.
     */
    function disableOptions() {
      const buttons = questionBox.querySelectorAll("button");
      buttons.forEach((btn, i) => {
        btn.disabled = true; // Disable all buttons
        if (i === questions[currentQuestion].answer) {
          btn.classList.add("bg-green-300"); // Highlight the correct answer
        }
      });
    }

    /**
     * Moves to the next question or displays the final result if all questions are answered.
     */
    function nextQuestion() {
      currentQuestion++; // Move to the next question index
      if (currentQuestion < questions.length) {
        showQuestion(currentQuestion); // Display the next question
        nextBtn.classList.add("hidden"); // Hide the Next button until an answer is selected
        startTimer(); // Start the timer for the new question
      } else {
        showResult(); // If no more questions, show the final result
      }
    }

    /**
     * Displays the final score and hides the quiz container.
     */
    function showResult() {
      quizContainer.classList.add("hidden"); // Hide the quiz container
      resultBox.classList.remove("hidden"); // Show the result box
      let resultText = `🎉 You scored ${score} out of ${questions.length}!`;

      // Show a summary of all questions, user's answers, and correct answers
      let summaryHtml = '<div class="mt-6 text-left">';
      questions.forEach((q, idx) => {
        // Find user's answer by checking which button was selected (store user's answers in an array)
        const userAnswer = userAnswers && userAnswers[idx] !== undefined ? userAnswers[idx] : null;
        const correctAnswer = q.answer;
        const isCorrect = userAnswer === correctAnswer;
        summaryHtml += `<div class="mb-4 p-4 rounded border ${isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white'}">
          <div class="font-semibold mb-2">${idx + 1}. ${q.question}</div>
          <div><span class="font-medium">Your answer:</span> ${userAnswer !== null ? q.options[userAnswer] : '<span class="italic text-gray-500">No answer</span>'}</div>
          <div><span class="font-medium">Correct answer:</span> ${q.options[correctAnswer]}</div>
        </div>`;
      });
      summaryHtml += '</div>';

      // Unlock the next level (if any) upon completion, regardless of score
      let showNextLevelBtn = false;
      let nextLevelKey = null;
      if (questions.length > 0) {
        const levelUnlocked = unlockNextLevel(currentLevelKey);
        const currentIndex = ALL_GLOBAL_LEVEL_KEYS.indexOf(currentLevelKey);
        if (levelUnlocked) {
          resultText += ` Great job! The next level is now unlocked!`;
        } else if (ALL_GLOBAL_LEVEL_KEYS.indexOf(currentLevelKey) === ALL_GLOBAL_LEVEL_KEYS.length - 1) {
          resultText += ` You've completed all available levels in all categories!`;
        } else {
          resultText += ` You've completed this level. Select another level or category to continue!`;
        }
        // If there is a next level, show the Next Level button
        if (currentIndex !== -1 && currentIndex < ALL_GLOBAL_LEVEL_KEYS.length - 1) {
          showNextLevelBtn = true;
          nextLevelKey = ALL_GLOBAL_LEVEL_KEYS[currentIndex + 1];
        }
      }
      resultBox.innerHTML = resultText + summaryHtml;
      if (showNextLevelBtn) {
        // Create a flex container for buttons
        const btnContainer = document.createElement('div');
        btnContainer.className = 'flex flex-row gap-4 mt-4 justify-center';

        // Move Play Again button into the container (left side)
        playAgainBtn.classList.remove('hidden');
        playAgainBtn.classList.add('order-1');
        btnContainer.appendChild(playAgainBtn);

        // Create Next Level button (right side)
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next Level';
        nextBtn.className = 'action-button order-2';
        nextBtn.onclick = function() {
          difficultyLevelSelect.value = nextLevelKey;
          startQuiz();
        };
        btnContainer.appendChild(nextBtn);

        resultBox.appendChild(btnContainer);
      } else {
        playAgainBtn.classList.remove('hidden'); // Show the Play Again button (default position)
      }
      playAgainBtn.classList.remove("hidden"); // Show the Play Again button
    }

    // Track user's answers for summary
    let userAnswers = [];

    // Event Listeners
    btnSchoolTBSE.addEventListener("click", () => {
        currentCategory = "SchoolEnglish";
        currentBoard = "TBSE";
        showClassSelectionPage();
    });

    btnSchoolCBSE.addEventListener("click", () => {
        currentCategory = "SchoolEnglish";
        currentBoard = "CBSE";
        showClassSelectionPage();
    });

    btnJobEnglish.addEventListener("click", () => {
        currentCategory = "JobEnglish";
        currentBoard = null; // No board for Job English
        currentClass = null; // No class for Job English
        showLevelSelectionPage(); // Directly go to level selection for Job English
    });

    startClassQuizBtn.addEventListener("click", () => {
        currentClass = parseInt(classSelect.value);
        showLevelSelectionPage(); // Now proceed to actual level selection
    });

    startQuizBtn.addEventListener("click", startQuiz);
    nextBtn.addEventListener("click", nextQuestion);
    playAgainBtn.addEventListener("click", () => {
      showHomePage(); // Go back to category selection
    });

    // Initial setup when the page loads
    initializeUnlockedLevels(); // Ensure default levels are unlocked
    showHomePage(); // Start on the home page