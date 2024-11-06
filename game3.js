const categories = {
    "Renewable vs Non-Renewable Materials": "Renewable materials like bamboo regrow quickly; non-renewable ones like coal take millions of years to form.",
    "Prefabrication": "A construction method through which the building parts are pre-made in factories and assembled on-site to reduce waste and costs.",
    "Reuse": "Using materials or products for the second time without major intervention or repair.",
    "Construction and Demolition Waste Management": "Reducing waste from building projects either during demolition phase or construction phase.",
    "Local Materials": "Using materials sourced from nearby to lower transport emissions and support the local economy.",
};


let selectedCategory = null;
let correctMatches = 0;
let currentSetIndex = 0;
const itemsPerSet = 5; // Set size per round
let confettiInterval; // To store the confetti interval

document.addEventListener('DOMContentLoaded', () => {
    const categoryGrid = document.getElementById("category-grid");
    const unitGrid = document.getElementById("unit-grid");
    const restartButton = document.getElementById('restartButton');
    const timerDisplay = document.getElementById('timer');
    let interval;
    let timeElapsed = 0;

    const categoriesArray = Object.keys(categories);

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createCard(text, clickHandler) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = text;
        card.addEventListener("click", () => clickHandler(card));
        return card;
    }

    function selectCategory(card) {
        if (selectedCategory) {
            selectedCategory.classList.remove("selected", "incorrect-match");
        }
        selectedCategory = card;
        selectedCategory.classList.add("selected");
    }
    function updateProgressBar() {
        const progressBar = document.getElementById("progressBar");
        const totalMatches = categoriesArray.length;
        const progressPercentage = (correctMatches / totalMatches) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${Math.round(progressPercentage)}%`;
    }

    function selectUnit(unitCard) {
        if (!selectedCategory) return; // No category selected yet
        const category = selectedCategory.textContent;
        const unit = unitCard.textContent;

        if (categories[category] === unit) {
            // Correct match
            selectedCategory.classList.add("correct-match", "disabled");
            unitCard.classList.add("correct-match", "disabled");
            correctMatches++;

            // Update the progress bar
            updateProgressBar();

            // Check if all matches are completed
            if (correctMatches === categoriesArray.length) {
                showCompletionMessage();
                return;
            }

            // Check if the current set (6 matches) is complete
            if (correctMatches % itemsPerSet === 0) {
                loadNextSet(); // Load the next set of items
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


    function loadNextSet() {
        categoryGrid.innerHTML = '';
        unitGrid.innerHTML = '';

        // Slice the next set of categories and units
        const currentSetCategories = categoriesArray.slice(currentSetIndex * itemsPerSet, (currentSetIndex + 1) * itemsPerSet);
        const currentSetUnits = currentSetCategories.map(category => categories[category]);

        // Shuffle units to randomize matching
        shuffle(currentSetUnits);

        // Add categories and units to the grid
        currentSetCategories.forEach(category => {
            categoryGrid.appendChild(createCard(category, selectCategory));
        });

        currentSetUnits.forEach(unit => {
            unitGrid.appendChild(createCard(unit, selectUnit));
        });

        currentSetIndex++; // Move to the next set
    }

    function showCompletionMessage() {
        // Clear the grids and stop the timer
        clearInterval(interval);
        categoryGrid.innerHTML = '';
        unitGrid.innerHTML = '';

        // Remove the "Phrase" and "Description" labels
        const headers = document.querySelectorAll('h2');
        headers.forEach(header => header.remove());

        // Display the congratulatory message
        const message = document.createElement('div');
        message.classList.add('completion-message');
        message.innerHTML = `
          <h2>Well done on completing this challenge!</h2>
          <p>Your reward code is: <strong>875</strong></p>
        `;
        document.body.appendChild(message);

        // Start continuous confetti effect
        confettiInterval = setInterval(() => {
            confetti({
                particleCount: 150,
                spread: 60,
                origin: { y: 0.6 }
            });
        }, 500); // Confetti pops every 300 milliseconds
    }

    function resetGame() {
        clearInterval(interval);
        clearInterval(confettiInterval); // Stop confetti on reset
        timeElapsed = 0;
        timerDisplay.textContent = '00:00';
        selectedCategory = null;
        correctMatches = 0;
        currentSetIndex = 0;

        // Remove any previous completion message
        const oldMessage = document.querySelector('.completion-message');
        if (oldMessage) {
            oldMessage.remove();
        }

        // Recreate the "Phrase" and "Description" labels
        const columnHeaders = document.querySelectorAll('h2');
        if (!columnHeaders.length) {
            const phraseHeader = document.createElement('h2');
            phraseHeader.textContent = 'Phrase';
            categoryGrid.parentElement.insertBefore(phraseHeader, categoryGrid);

            const descriptionHeader = document.createElement('h2');
            descriptionHeader.textContent = 'Description';
            unitGrid.parentElement.insertBefore(descriptionHeader, unitGrid);
        }

        // Shuffle the entire set of categories
        shuffle(categoriesArray);

        loadNextSet(); // Start with the first set

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
    resetGame(); // Initialise the game on page load
});
