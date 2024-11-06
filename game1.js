document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const guessInput = document.getElementById('guessInput');
    const timerDisplay = document.getElementById('timer');

    const sdgTitleElement = document.getElementById('sdg-title');
    const sdgDescriptionElement = document.getElementById('sdg-description');

    let score = 0;
    let currentCard = null;
    let interval = null;
    let timeElapsed = 0;
    let confettiInterval = null;
    let revealedCards = 0;

    const sdgDescriptions = {
        1: "End poverty in all its forms everywhere.",
        2: "End hunger, achieve food security and improved nutrition, and promote sustainable agriculture.",
        3: "Ensure healthy lives and promote well-being for all at all ages.",
        4: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
        5: "Achieve gender equality and empower all women and girls.",
        6: "Ensure availability and sustainable management of water and sanitation for all.",
        7: "Ensure access to affordable, reliable, sustainable, and modern energy for all.",
        8: "Promote sustained, inclusive, and sustainable economic growth, full and productive employment, and decent work for all.",
        9: "Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.",
        10: "Reduce inequality within and among countries.",
        11: "Make cities and human settlements inclusive, safe, resilient, and sustainable.",
        12: "Ensure sustainable consumption and production patterns.",
        13: "Take urgent action to combat climate change and its impacts.",
        14: "Conserve and sustainably use the oceans, seas, and marine resources for sustainable development.",
        15: "Protect, restore, and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.",
        16: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable, and inclusive institutions at all levels.",
        17: "Strengthen the means of implementation and revitalize the global partnership for sustainable development."
    };

    const sdgs = [
        { id: 1, name: "No Poverty", imagePath: "images/E-WEB-Goal-01.png", revealed: false },
        { id: 2, name: "Zero Hunger", imagePath: "images/E-WEB-Goal-02.png", revealed: false },
        { id: 3, name: "Good Health and Well-being", imagePath: "images/E-WEB-Goal-03.png", revealed: false },
        { id: 4, name: "Quality Education", imagePath: "images/E-WEB-Goal-04.png", revealed: false },
        { id: 5, name: "Gender Equality", imagePath: "images/E-WEB-Goal-05.png", revealed: false },
        { id: 6, name: "Clean Water and Sanitation", imagePath: "images/E-WEB-Goal-06.png", revealed: false },
        { id: 7, name: "Affordable and Clean Energy", imagePath: "images/E-WEB-Goal-07.png", revealed: false },
        { id: 8, name: "Decent Work and Economic Growth", imagePath: "images/E-WEB-Goal-08.png", revealed: false },
        { id: 9, name: "Industry, Innovation, and Infrastructure", imagePath: "images/E-WEB-Goal-09.png", revealed: false },
        { id: 10, name: "Reduced Inequality", imagePath: "images/E-WEB-Goal-10.png", revealed: false },
        { id: 11, name: "Sustainable Cities and Communities", imagePath: "images/E-WEB-Goal-11.png", revealed: false },
        { id: 12, name: "Responsible Consumption and Production", imagePath: "images/E-WEB-Goal-12.png", revealed: false },
        { id: 13, name: "Climate Action", imagePath: "images/E-WEB-Goal-13.png", revealed: false },
        { id: 14, name: "Life Below Water", imagePath: "images/E-WEB-Goal-14.png", revealed: false },
        { id: 15, name: "Life on Land", imagePath: "images/E-WEB-Goal-15.png", revealed: false },
        { id: 16, name: "Peace, Justice and Strong Institutions", imagePath: "images/E-WEB-Goal-16.png", revealed: false },
        { id: 17, name: "Partnerships for the Goals", imagePath: "images/E-WEB-Goal-17.png", revealed: false },
        { id: 18, name: "", imagePath: "", revealed: false } // Placeholder for the duplicate SDG
    ];

    const randomDuplicateIndex = Math.floor(Math.random() * 17);
    sdgs[17] = { ...sdgs[randomDuplicateIndex], id: 18 };

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(sdgs);

    function initGame() {
        revealedCards = 0; // Reset revealed card count
        currentCard = null; // Reset the current card selection
        guessInput.disabled = false; // Ensure the input is enabled for user input

        // Clear previous SDG title and description
        sdgTitleElement.textContent = '';
        sdgDescriptionElement.textContent = '';

        gameBoard.innerHTML = ''; // Clear game board
        sdgs.forEach(sdg => {
            const card = document.createElement('div');
            card.dataset.id = sdg.id;
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${sdg.imagePath}" alt="${sdg.name}">
                    </div>
                    <div class="card-back"></div>
                </div>
            `;
            card.addEventListener('click', () => flipCard(card, sdg));
            gameBoard.appendChild(card);
        });
        scoreDisplay.textContent = `Score: ${score}`;

        timeElapsed = 0;
        timerDisplay.textContent = `Time elapsed: ${timeElapsed} seconds`;

        startTimer();
    }

    function flipCard(cardElement, sdg) {
        if (!currentCard && !sdg.revealed) { // Only flip if no card is currently selected and the card is not revealed
            cardElement.classList.add('flipped');
            currentCard = { cardElement, sdg }; // Set the current card to be checked against input
        }
    }

    function checkAnswer(inputValue) {
        if (!currentCard) return; // Don't process if no card is flipped

        const { cardElement, sdg } = currentCard;

        // Mark the card as revealed permanently after a guess, regardless of whether the guess is correct or not
        sdg.revealed = true;
        revealedCards++;  // Increase the revealed card count

        // Check if the answer is correct
        const isCorrect = inputValue.trim().toLowerCase() === sdg.name.toLowerCase();

        // Update the score based on the guess
        if (isCorrect) {
            score++;  // Increment the score for correct guesses
        } else {
            score--;  // Decrement the score for incorrect guesses
        }

        // Clamp the score between -18 and 18
        score = Math.max(-18, Math.min(score, 18));

        // Update score display
        scoreDisplay.textContent = `Score: ${score}`;

        // Show the correct answer and description after guessing
        updateSDGDetails(sdg);

        currentCard = null; // Clear current card after checking

        // Clear the input field
        guessInput.value = '';

        checkGameEnd();  // Check if the game is over
    }

    // Function to update SDG title and description after the guess
    function updateSDGDetails(sdg) {
        // Set SDG name directly without adding "Correct answer is:" multiple times
        sdgTitleElement.textContent = `${sdg.name}`;
        sdgDescriptionElement.textContent = sdgDescriptions[sdg.id];
    }

    // Function to check if all cards are revealed (game over)
    function checkGameEnd() {
        if (revealedCards === 18) { // When the 18th card is revealed
            console.log("All cards revealed! Ending the game.");
            showCompletionMessage(); // Trigger the end of the game
        }
    }

function showCompletionMessage() {
    clearInterval(interval); // Stop the timer
    guessInput.disabled = true; // Disable input after the game is over
    
    // Pass the score and time elapsed to the end page using URL parameters
    const finalScore = score;
    const finalTimeElapsed = timeElapsed;
    
    // Redirect to game1end.html and pass score and time via URL parameters
    window.location.href = `game1end.html?score=${finalScore}&time=${finalTimeElapsed}`;
}
    function goBackToIndex() {
        console.log("Navigating back to indexCENTRAL");
        window.location.href = "indexCENTRAL.html";
    }

    // Check answer when Enter key is pressed
    guessInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkAnswer(event.target.value);
            event.preventDefault();
        }
    });

    // Initialize the game
    initGame();

    // Function to start the timer
    function startTimer() {
        interval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Function to reset and restart the game
    function restartGame() {
        clearInterval(interval); // Stop any ongoing timer
        clearInterval(confettiInterval); // Stop continuous confetti
        timeElapsed = 0;
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        guessInput.disabled = false; // Re-enable input on restart

        // Reset revealed state of all cards
        sdgs.forEach(sdg => {
            sdg.revealed = false; // Set all cards as not revealed
        });

        initGame(); // Re-initialize the game board and shuffle cards
    }

    // Restart the game when the "Restart Game" button is clicked
    const restartBtn = document.getElementById('restartButton');
    restartBtn.addEventListener('click', restartGame);
});


document.getElementById('goToMainMenu').addEventListener('click', () => {
    window.location.href = "index.html";
});
