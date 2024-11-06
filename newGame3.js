const categories = {
    "Primary Raw Material": "A type of resource that is extracted from the planet and used as inputs for industrial production. They are not processed or altered and are used in the first life cycle stage in the creation of a finished product.",
    "Secondary Raw Material": "A type of resource that is recovered from previous use or is recovered waste originating from another product system and utilized as an input in another product system. Often, secondary raw material sources are recycled ones.",
    "Recyclable Material": "A type of resource that has the natural characteristics to be diverted from the waste stream thanks to available recycling processes and programs. Once collected, they undergo processing to return to the value chain and further (re)use, often as raw materials for manufacturing or production.",
    "Renewable Material": "A type of resource that can be grown, harvested and naturally replenished or cleansed on a human time scale.",
    "Hazardous Material": "According to the Waste Directive 2008/98/EC, hazardous materials are sourced from the type of resources that will cause health damage to humans, animals, plants, living organisms, and the environment."
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
