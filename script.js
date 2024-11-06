document.getElementById('draggable-A1').addEventListener('dragstart', event => {
    event.dataTransfer.setData('text/plain', event.target.id);
  });
  
  const gameArea = document.getElementById('game-area');
  const dropZoneA1 = document.getElementById('drop-zone-A1');
  const tolerance = 50; // pixels of tolerance for dropping the piece
  
  dropZoneA1.addEventListener('dragover', event => {
    event.preventDefault(); // Necessary to allow dropping
  });
  
  dropZoneA1.addEventListener('drop', event => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
  
    // Get the game area's position to calculate the drop correctly
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    // Get the drop position relative to the gameArea
    const dropPositionX = event.clientX - gameAreaRect.left;
    const dropPositionY = event.clientY - gameAreaRect.top;
  
    // Check if the piece is within the tolerated range
    if (id === 'draggable-A1' && isWithinTolerance(dropPositionX, dropPositionY)) {
      dropZoneA1.appendChild(draggable);
      draggable.style.position = 'absolute';
      draggable.style.left = `${dropZoneA1.offsetLeft}px`;
      draggable.style.top = `${dropZoneA1.offsetTop}px`;
  
      onPuzzleSolved();
    } else {
      // Optionally handle incorrect placement
    }
  });
  
  function isWithinTolerance(dropX, dropY) {
    // Calculate the center of the drop zone
    const dropZoneRect = dropZoneA1.getBoundingClientRect();
    const centerX = dropZoneRect.left + dropZoneRect.width / 2 - gameArea.getBoundingClientRect().left;
    const centerY = dropZoneRect.top + dropZoneRect.height / 2 - gameArea.getBoundingClientRect().top;
  
    // Check if the drop position is within the tolerance range of the drop zone center
    return Math.abs(dropX - centerX) <= tolerance && Math.abs(dropY - centerY) <= tolerance;
  }
  
  function onPuzzleSolved() {
    alert('Congratulations! You have placed A1 correctly!');
    // Additional code to handle game completion can go here
  }
  