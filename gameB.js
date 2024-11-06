const categories = {
    "Climate change": "kg CO2-eq or kilograms of carbon dioxide equivalent: Measures greenhouse gas emissions in terms of their global warming potential. Example: Driving a petrol car for 100 km emits 20 kg CO2-eq.",
    "Ozone depletion": "Unit: kg CFC11-eq, pronounced: kilograms of CFC-11 equivalent. Description: Measures the potential of substances to harm the ozone layer. Example: Using certain refrigerants can have an ozone depletion potential of 0.1 kg CFC11-eq per kg of refrigerant used.",
    "Eutrophication": "Unit: kg PO4-eq, pronounced: kilograms of phosphate equivalent. Description: Measures nutrient overload in freshwater, leading to algal blooms. Example: Fertiliser runoff contributing 5 kg PO4-eq can cause algae to overgrow in lakes.",
    "Photochemical ozone formation": "Unit: kg NMVOC-eq, pronounced: kilograms of non-methane volatile organic compounds equivalent. Description: Measures the formation of ground-level ozone from air pollutants. Example: Vehicle emissions can contribute to photochemical ozone formation of 0.5 kg NMVOC-eq.",
    "Eco-toxicity": "Unit: CTUe, pronounced: comparative toxic units for ecosystems. Description: Measures the toxic impact of chemicals on freshwater ecosystems. Example: Pesticide runoff causing 50 CTUe indicates toxicity in rivers.",
    "Human toxicity": "Unit: CTUh, pronounced: comparative toxic units for humans. Description: Measures the potential health risks of substances, both cancerous and non-cancerous. Example: Exposure to hazardous chemicals can result in 0.01 CTUh.",
    "Ionizing radiation": "Unit: kBq U-235, pronounced: kilobecquerel of uranium-235 equivalent. Description: Measures human exposure to ionizing radiation. Example: A nuclear facility might release 100 kBq U-235 equivalent over time."
};


let selectedCategory = null;
let correctMatches = 0; // To track the number of correct matches
const totalMatchesRequired = 5; // Set how many correct matches are needed



document.addEventListener('DOMContentLoaded', () => {
    const categoryGrid = document.getElementById("category-grid");
    const unitGrid = document.getElementById("unit-grid");
    const restartButton = document.getElementById('restartButton');
    const timerDisplay = document.getElementById('timer');
    let interval;
    let timeElapsed = 0;

    function shuffleAndSlice(array, count) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.slice(0, count);
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
                gameBCompleted(); // Call the completion function
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

        const shuffledCategories = shuffleAndSlice(Object.keys(categories), totalMatchesRequired);
        const shuffledUnits = shuffleAndSlice(shuffledCategories.map(category => categories[category]), totalMatchesRequired);

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
});

function gameBCompleted() {
    // Show the "Next Step" button
    document.getElementById("nextStepContainer").style.display = "block"; // Assuming the Next Step button is in the HTML
}
function goToNextGame() {
    window.location.href = "gameC.html"; // Make sure this is the correct path to Game C
}