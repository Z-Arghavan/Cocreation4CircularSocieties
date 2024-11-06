const draggableElements = document.querySelectorAll(".draggable");
const droppableElements = document.querySelectorAll(".droppable");

// Draggable event listeners
draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart); // Ensure function name matches here
});

// Droppable event listeners
droppableElements.forEach(elem => {
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", drop);
});

// Drag and Drop functions
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id); // Correct 'dataTransfer'
}

function dragEnter(event) {
    if (!event.target.classList.contains("dropped")) {
        event.target.classList.add("droppable-hover");
    }
}

function dragOver(event) {
    if (!event.target.classList.contains("dropped")) {
        event.preventDefault(); // This allows for the drop event to fire
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

    const draggableElementData = event.dataTransfer.getData("text");
    const droppableElementData = event.target.getAttribute("data-draggable-id");

    if (draggableElementData === droppableElementData) {
        event.target.classList.add("dropped");
        const draggableElement = document.getElementById(draggableElementData);

        // Clone the image and append it to the droppable area
        const clonedImage = draggableElement.cloneNode(true);
        clonedImage.classList.add('dropped-image'); // Ensure you have this class in your CSS
        clonedImage.draggable = false; // The cloned image should not be draggable

        // Clear out the droppable container and append the cloned image
        event.target.innerHTML = '';
        event.target.appendChild(clonedImage);

        // Optionally, hide the original draggable image
        draggableElement.classList.add("dragged");
    }
}
