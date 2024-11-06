const categories = {
    "Cradle to Gate": {
        definition: "From raw materials extraction to the factory door", 
        description: "This process covers from extraction of raw materials to the point they are ready to leave the factory."
    },
    "Cradle to Practical Completion": {
        definition: "From raw materials extraction to a finished building", 
        description: "This includes everything from raw materials to the completion of a fully constructed building."
    },
    "Cradle to Grave": {
        definition: "From start to finish, including disposal - one entire life cycle", 
        description: "This process spans the full lifecycle of a product from creation to its disposal."
    },
    "Cradle to Cradle": {
        definition: "Designed to live on and on!", 
        description: "A sustainable lifecycle where products are designed to be recycled or reused continuously."
    }
};

let selectedCategory = null;
let correctMatches = 0;
let currentSetIndex = 0;
const itemsPerSet = 6; // Set size per round
let confettiInterval;

document.addEventListener('DOMContentLoaded', () => {
    const categoryGrid = document.getElementById("category-grid");
    const unitGrid = document.getElementById("unit-grid");
    const descriptionBox = document.getElementById('description-box');
    const descriptionText = document.getElementById('description-text');
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

    function selectUnit(unitCard) {
        if (!selectedCategory) return;
        const category = selectedCategory.textContent;
        const unit = unitCard.textContent;

        if (categories[category].definition === unit) { // Compare with the definition
            selectedCategory.classList.add("correct-match", "disabled");
            unitCard.classList.add("correct-match", "disabled");
            correctMatches++;

            // Show the description based on the category
            showDescriptionBox(category);

            if (correctMatches === categoriesArray.length) {
                gameCCompleted(); // Trigger completion
                return;
            }

            if (correctMatches % itemsPerSet === 0) {
                loadNextSet();
            }
        } else {
            selectedCategory.classList.add("incorrect-match");
            unitCard.classList.add("incorrect-match");
            setTimeout(() => {
                selectedCategory.classList.remove("selected", "incorrect-match");
                unitCard.classList.remove("incorrect-match");
            }, 1000);
        }
        selectedCategory = null;
    }

    function showDescriptionBox(category) {
        // Set the description from the new 'description' property in the categories object
        descriptionText.textContent = categories[category].description;
        descriptionBox.style.display = 'block'; // Show the description box
    }

    function loadNextSet() {
        categoryGrid.innerHTML = '';
        unitGrid.innerHTML = '';

        const currentSetCategories = categoriesArray.slice(currentSetIndex * itemsPerSet, (currentSetIndex + 1) * itemsPerSet);
        const currentSetUnits = currentSetCategories.map(category => categories[category].definition); // Fetch only the 'definition'

        shuffle(currentSetUnits);

        currentSetCategories.forEach(category => {
            categoryGrid.appendChild(createCard(category, selectCategory));
        });

        currentSetUnits.forEach(unit => {
            unitGrid.appendChild(createCard(unit, selectUnit));
        });

        currentSetIndex++;
    }

    loadNextSet(); // Initialize the first set
});

function gameCCompleted() {
    console.log("Game C completed! Showing Next Step button.");
    // Show the "Next Step" button upon game completion
    document.getElementById("nextStepContainer").style.display = "block";
}

function goToNextGame() {
    console.log("Next Step button clicked. Redirecting to Game D...");
    window.location.href = "gameD.html"; // Redirect to Game D
}