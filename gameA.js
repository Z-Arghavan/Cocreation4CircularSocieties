// JavaScript for drag-and-drop functionality

let totalDraggableItems = 5;  // Update this if you have more/less draggable items
let droppedItemsCount = 0;    // This will track how many items have been dropped

// Shuffle function to randomize draggable elements
function shuffleElements(container) {
    const elementsArray = Array.from(container.children); // Get all children of the container
    for (let i = elementsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        container.appendChild(elementsArray[j]); // Re-append elements in random order
    }
}

// Draggable event listeners for newly shuffled elements
function addDragEventListeners() {
    const draggableElements = document.querySelectorAll(".draggable");

    draggableElements.forEach(elem => {
        elem.addEventListener("dragstart", dragStart);
    });
}

// Attach drop-related event listeners to droppable elements
function addDropEventListeners() {
    const droppableElements = document.querySelectorAll(".droppable");

    droppableElements.forEach(elem => {
        elem.addEventListener("dragenter", dragEnter);
        elem.addEventListener("dragover", dragOver);
        elem.addEventListener("dragleave", dragLeave);
        elem.addEventListener("drop", drop);
    });
}

// Drag and Drop functions
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id); // Store the ID of the dragged element
}

function dragEnter(event) {
    if (!event.target.classList.contains("dropped")) {
        event.target.classList.add("droppable-hover");
    }
}

function dragOver(event) {
    if (!event.target.classList.contains("dropped")) {
        event.preventDefault(); // Prevent default to allow drop
    }
}

function dragLeave(event) {
    if (!event.target.classList.contains("dropped")) {
        event.target.classList.remove("droppable-hover");
    }
}

function drop(event) {
    event.preventDefault();
    event.target.classList.remove("droppable-hover");

    const draggableElementData = event.dataTransfer.getData("text"); // Get the dragged element's ID
    const droppableElementData = event.target.getAttribute("data-draggable-id");

    if (draggableElementData === droppableElementData) {
        event.target.classList.add("dropped");
        const draggableElement = document.getElementById(draggableElementData);

        const clonedImage = draggableElement.cloneNode(true); // Clone the dragged element
        clonedImage.classList.add('dropped-image');
        clonedImage.draggable = false;

        event.target.innerHTML = ''; // Clear the droppable area
        event.target.appendChild(clonedImage); // Append the cloned image

        draggableElement.classList.add("dragged"); // Mark the original as dragged

        // Increment dropped items count and update progress bar
        droppedItemsCount++;
        updateProgressBar();
    }
}

// Timer and Restart functionality
let timerInterval;

function startTimer() {
    let seconds = 0;
    timerInterval = setInterval(function () {
        seconds++;
        let minutesPart = Math.floor(seconds / 60);
        let secondsPart = seconds % 60;
        document.getElementById('timer').textContent =
            minutesPart.toString().padStart(2, '0') + ':' +
            secondsPart.toString().padStart(2, '0');
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = "00:00";
    startTimer();
}

// Shuffle and restart logic
document.getElementById('restartButton').addEventListener('click', function () {
    const draggableContainer = document.querySelector('.draggable-elements');
    
    // Shuffle the draggable elements at the top
    shuffleElements(draggableContainer);

    // Re-add drag and drop event listeners after shuffling
    addDragEventListeners();
    addDropEventListeners();

    // Reset all draggable elements
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach(elem => {
        elem.style.display = 'block';
        elem.classList.remove('dragged');
        elem.setAttribute('draggable', 'true');
    });

    // Reset all droppable areas
    const droppableElements = document.querySelectorAll('.droppable');
    droppableElements.forEach(elem => {
        elem.innerHTML = '<span>?</span>';
        elem.classList.remove('dropped');
    });

    // Reset progress bar and dropped count
    droppedItemsCount = 0;
    updateProgressBar();

    resetTimer(); // Reset the timer
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    const draggableContainer = document.querySelector('.draggable-elements');

    // Shuffle the draggable elements when the page loads
    shuffleElements(draggableContainer);

    // Start timer and add event listeners
    startTimer();
    addDragEventListeners();
    addDropEventListeners();
});

// Function to update the progress bar and percentage
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentageText = document.getElementById('progress-percentage');
    const progressPercentage = (droppedItemsCount / totalDraggableItems) * 100;

    progressBar.style.width = progressPercentage + '%';  // Update progress bar width
    progressPercentageText.textContent = Math.round(progressPercentage) + '%';  // Update percentage text
}
