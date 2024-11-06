const categories = {
    "Refuse": "Even before use or produce, try to out-design excess resources/waste.",
    "Rethink": "Think about ways to make products'in more lifecycles (example: by sharing the product).",
    "Reduce": "Use fewer natural resources and materials",
    "Reuse": "Reuse by another consumer Or discarded products which are still in as-good-as-new condition and functional.",
    "Refurbish": "Restore old products and make them up-to-date.",
    "Repurpose": "Use parts of discarded products in new products with different functions.",
    "Recycle": "Process materials to achieve the same  or lower quality.",
};

let selectedCategory = null;
let correctMatches = 0; // To track the number of correct matches
const totalMatchesRequired = Object.keys(categories).length; // Set total matches required based on the number of categories

document.addEventListener('DOMContentLoaded', () => {
    const categoryGrid = document.getElementById("category-grid");
    const unitGrid = document.getElementById("unit-grid");
    const restartButton = document.getElementById('restartButton');
    const completeGameButton = document.getElementById('complete-game');
    const timerDisplay = document.getElementById('timer');
    let interval;
    let timeElapsed = 0;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCard(text, clickHandler) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = text;
        card.addEventListener("click", () => clickHandler(card));
        return card;
    }

    function selectCategory(card) {
        const allCategoryCards = document.querySelectorAll('.card');
        allCategoryCards.forEach(card => card.classList.remove("selected", "incorrect-match"));
        if (selectedCategory) {
            selectedCategory.classList.remove("selected");
        }
        selectedCategory = card;
        selectedCategory.classList.add("selected");
    }

    function selectUnit(unitCard) {
        if (!selectedCategory) return; // No category selected yet
        const category = selectedCategory.textContent;
        const unit = unitCard.textContent;

        if (categories[category] === unit) {
            // Correct match
            selectedCategory.classList.add("correct-match", "disabled");
            unitCard.classList.add("correct-match", "disabled");
            correctMatches++; // Increment correct matches

            // Check if the player has completed all matches
            if (correctMatches === totalMatchesRequired) {
                gameCompleted(); // Call the completion function
            }
        } else {
            // Incorrect match
            selectedCategory.classList.add("incorrect-match");
            unitCard.classList.add("incorrect-match");
            setTimeout(() => {
                selectedCategory.classList.remove("selected", "incorrect-match");
                unitCard.classList.remove("incorrect-match");
            }, 1000); // Reset after 1 second
        }
        // Clear selected category
        selectedCategory = null;
    }

    function resetGame() {
        clearInterval(interval);
        timeElapsed = 0;
        correctMatches = 0; // Reset the number of correct matches
        timerDisplay.textContent = '00:00';
        categoryGrid.innerHTML = '';
        unitGrid.innerHTML = '';

        const shuffledCategories = shuffleArray(Object.keys(categories));
        const shuffledUnits = shuffleArray(Object.values(categories));

        shuffledCategories.forEach(category => {
            categoryGrid.appendChild(createCard(category, selectCategory));
        });

        shuffledUnits.forEach(unit => {
            unitGrid.appendChild(createCard(unit, selectUnit));
        });

        // Ensure all cards are reset properly
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('correct-match', 'incorrect-match', 'disabled');
        });

        startTimer();
    }

    function startTimer() {
        interval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    restartButton.addEventListener('click', resetGame);
    resetGame(); // Initialise the game

    // Add event listener to the "Complete Game" button
    completeGameButton.addEventListener('click', () => {
        window.location.href = "indexR.html"; // Redirect back to the main game page
    });
});

// Function to show the completion message and show the "Complete Game" button
function gameCompleted() {
    // Show a success message
    alert("Well done! You've completed the game!");

    // Show the "Complete Game" button
    document.getElementById("complete-game").style.display = "block";
}

function showCompleteButton() {
    const completeButton = document.getElementById('complete-game');
    completeButton.style.display = 'inline-block'; // Show the button when appropriate
}
