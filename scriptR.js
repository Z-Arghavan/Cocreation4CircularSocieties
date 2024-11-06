let currentSquare = 0; // Start from square 0 (correct indexing)
let diceRolling = false; // Prevent multiple rolls at once
let gameEnded = false; // Track if the game has ended
// Initialize pawnData with default values if localStorage is empty
let pawnData = { position: 0, tokens: 100, spentTokens: 0 }; // Default data

const totalSquares = 22; // 22 squares in the layout
const tokenPrice = 5; // Token price for regular squares
const specialSquareTokenValue = 20; // Token value for squares 8, 12, and 19

// DOM elements
const diceDisplay = document.getElementById('dice-display');
const rollDiceBtn = document.getElementById('roll-dice');
const pawn = document.getElementById('pawn'); // Pawn element

const descriptionBox = document.getElementById('description1'); // Description box
const initialTokenDisplay = document.getElementById('initial-token'); // For displaying Initial Circular Tokens
const circularTokenDisplay = document.getElementById('circular-token'); // For displaying Circular Tokens
// Select the buttons from the DOM
const acceptBtn = document.getElementById('accept-btn');
const rejectBtn = document.getElementById('reject-btn');
const decisionButtons = document.getElementById('decision-buttons');



// Array of squares in the corrected sequence around the board
const squareSequence = [
  'square-1', 'square-2', 'square-3', 'square-4', 'square-5', 'square-6', 'square-7', 'square-8',  // Top Row
  'square-9', 'square-10', 'square-11', 'square-12',  // Right Column
  'square-13', 'square-14', 'square-15', 'square-16', 'square-17', 'square-18',  // Bottom Row
  'square-19', 'square-20', 'square-21', 'square-22'  // Left Column
];

const squareDescriptions = [
  'Lets circular up the city',                                                      // Index 0 (Square 1)
  'DESIGN FOR DECONSTRUCTION: Buildings are designed to be easily taken apart, allowing materials to be reused. ',  // Index 1 (Square 2)
  'DESIGN FOR DISASSEMBLY: Products/Components are designed to be separated without damaging them, promoting reuse. ',        // Index 2 (Square 3)
  'DEMOLITION SITE: A location where buildings are dismantled, often resulting in large amounts of waste. ',                        // Index 3 (Square 4)
  'REUSE STRUCTURAL FRAME: The core structure of a building is preserved and repurposed for future projects. ',       // Index 4 (Square 5)
  'DESIGN FOR ADAPTABILITY: Buildings are designed to be flexible, allowing them to be modified or repurposed as needs change. ',  // Index 5 (Square 6)
  'DESIGN FOR REGENERATION: Buildings that actively contribute to environmental improvement, such as enhancing biodiversity. ',   // Index 6 (Square 7)
  'MINI-GAME (HIERARCHY): Earn tokens by arranging elements in a circular resource hierarchy. ',     // Index 7 (Square 8)
  'DIGITAL TWIN: A virtual model of a physical building that helps optimize performance and resource use. ',                                    // Index 8 (Square 9)
  'PREFABRICATION: Building parts are manufactured off-site and assembled later, reducing waste and construction time.',         // Index 9 (Square 10)
  'LANDSCAPE PACK: A collection of strategies for managing outdoor spaces with a focus on sustainability. ',                                    // Index 10 (Square 11)
  'MINI-GAME (D HIERARCHY): A mini-game focusing on the hierarchy of design elements in the built environment. ',   // Index 11 (Square 12)
  'Product As A Service: Products are leased rather than sold, encouraging longevity and reuse. ',                   // Index 12 (Square 13)
  'BIO-BASED MATERIALS: Construction materials made from renewable biological sources.',              // Index 13 (Square 14)
  'HAZARDOUS MATERIALS: Materials that require special handling and disposal due to their dangerous properties. ',   // Index 14 (Square 15)
  'WASTE AUDIT: An evaluation of waste generation and management practices to improve efficiency. ',                 // Index 15 (Square 16)
  'MAINTENANCE AND RETROFIT: Ongoing improvements to extend the lifespan of existing buildings. ',     // Index 16 (Square 17)
  'CONSTRUCTION AND DEMOLITION WASTE: Debris produced during building construction or demolition. ',                // Index 17 (Square 18)
  'MINI-GAME (CIRCULAR RESOURCES): Earn tokens by efficiently managing circular resources. ',                     // Index 18 (Square 19)
  'MATERIAL BANK: A digital platform for tracking and managing building materials for reuse. ',                      // Index 19 (Square 20)
  'DIGITAL PRODUCT PASSPORT: A digital document containing all necessary information about a product’s lifecycle. ', // Index 20 (Square 21)
  'DESIGN WITH REUSABLES: Incorporating reusable materials into construction to reduce waste. '       // Index 21 (Square 22)
];

// Mapping of square indices to types
const squareTypes = {
  penalty: [3, 10, 14, 17], // Squares with penalties
  reward: [8, 12, 15, 19, 20], // Squares with percentage rewards
  miniGame: [7, 11, 18], // Squares with mini-games
};

// Function to add icons to squares
function addIconsToSquares() {
  for (let i = 0; i < squareSequence.length; i++) {
    const squareId = squareSequence[i];
    const squareElement = document.getElementById(squareId);

    let icon = ''; // Initialize icon variable

    // Check if the square is a mini-game square
    if (squareTypes.miniGame.includes(i)) {
      icon = '♻️'; // Recycle icon for mini-game squares
    } else if (squareTypes.penalty.includes(i)) {
      icon = '💀'; // Dead fish emoji (penalty square)
    } else if (squareTypes.reward.includes(i)) {
      icon = '💡'; // Star emoji (reward square)
    } else {
      icon = '🍃'; // Leaf emoji (regular square)
    }

    // Ensure the square element exists before appending the icon
    if (squareElement) {
      // Append the icon to the existing content
      squareElement.innerHTML += ` <span class="icon">${icon}</span>`;
    } else {
      console.error(`Square with ID ${squareId} not found!`);
    }
  }
}


// Function to display description when hovering over a square
function showDescription(squareIndex) {
  const descriptionArea = document.getElementById('description1');
  descriptionArea.innerHTML = `<p>${squareDescriptions[squareIndex]}</p>`;
}

// Attach event listeners to each square
for (let i = 1; i <= 22; i++) {
  const squareElement = document.getElementById(`square-${i}`);
  if (squareElement) {
    // Show description when hovering over the square
    squareElement.addEventListener('mouseover', () => showDescription(i - 1)); // Adjust for 0-based index
  }
}


// Ensure the tokens are not null or NaN
function sanitizePawnData() {
  if (pawnData.tokens == null || isNaN(pawnData.tokens)) pawnData.tokens = 100;
  if (pawnData.spentTokens == null || isNaN(pawnData.spentTokens)) pawnData.spentTokens = 0;
}

// Function to update the token displays
function updateTokenDisplay() {
  // Sanitize the token values to prevent null or NaN issues
  sanitizePawnData();

  // Update the Initial Circular Token display
  initialTokenDisplay.textContent = pawnData.tokens;

  // Update the Circular Token display
  circularTokenDisplay.textContent = pawnData.spentTokens;
}

// Call updateTokenDisplay() at the beginning to show the initial values
updateTokenDisplay();

// Function to roll the dice
function rollDice() {
  if (diceRolling || gameEnded) return; // Prevent rolling again until movement is complete or if the game has ended
  diceRolling = true;

  let diceRoll = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 6

  // Ensure first roll doesn't land on square 4
  if (pawnData.position === 0 && diceRoll === 3) {
    // If it's the first roll and would land on square 4, re-roll
    diceRoll = (diceRoll % 6) + 1; // Shift the roll to another number between 1 and 6
  }

  // Display both the number and the dice dots (Unicode character)
  diceDisplay.innerHTML = `🎲 ${diceRoll} (&#x268${diceRoll - 1};)`; // Show number and Unicode dice character

  // Move the pawn forward by the number rolled
  movePawn(diceRoll);
}


function movePawn(steps) {
  let newSquare = pawnData.position + steps;

  // Check if the pawn is going to pass or land on square 22 (game over square)
  if (newSquare >= totalSquares - 1) { // totalSquares - 1 is square 22 (zero-based index)
    newSquare = totalSquares - 1; // Force landing exactly on square 22
    moveOneSquare(pawnData.position, newSquare, steps);

    // Trigger the end of the game
    endGame();
    return;
  }

  // Proceed with normal movement if not ending the game
  moveOneSquare(pawnData.position, newSquare, steps);
}


// Recursive function to move the pawn step by step
function moveOneSquare(currentPosition, targetSquare, remainingSteps) {
  if (remainingSteps <= 0) {
    pawnData.position = targetSquare; // Update pawn position
    handleSquareEvent(pawnData.position); // Handle the final landing square
    diceRolling = false; // Allow another roll after the move is complete
    savePawnData(); // Save the pawn's state
    return;
  }

  // Calculate the next square index
  currentPosition = (currentPosition + 1) % totalSquares;
  movePawnToSquare(currentPosition);

  // Wait for a short time, then move to the next square
  setTimeout(() => {
    moveOneSquare(currentPosition, targetSquare, remainingSteps - 1); // Recursive call
  }, 500); // Move every 0.5 seconds
}

// Function to move the pawn to a specific square by index
function movePawnToSquare(squareIndex) {
  const nextSquareId = squareSequence[squareIndex];
  const nextSquare = document.getElementById(nextSquareId);

  if (!nextSquare) {
    console.error(`Square with ID ${nextSquareId} not found!`);
    return;
  }
  // Get the bounding rectangle of the next square for positioning
  const rect = nextSquare.getBoundingClientRect();

  console.log(`Moving pawn to square ${squareIndex + 1}: (top: ${rect.top}, left: ${rect.left})`);

  // Move the pawn to the next square with a small offset to avoid covering the icons/text
  pawn.style.position = 'absolute'; // Ensure the pawn's position is absolute

  // Offset the pawn so it lands next to the icons, not overlapping them
  const pawnOffsetX = 30;  // Adjust this value for horizontal offset (left/right)
  const pawnOffsetY = 10;  // Adjust this value for vertical offset (top/bottom)
  // Move the pawn to the correct position next to the icons
  pawn.style.top = `${rect.top + window.scrollY + pawnOffsetY}px`; // Adjust vertical position
  pawn.style.left = `${rect.left + window.scrollX + pawnOffsetX}px`; // Adjust horizontal position


  console.log(`Pawn new position: top=${pawn.style.top}, left=${pawn.style.left}`);
}

// Function to save pawn data into localStorage
function savePawnData() {
  localStorage.setItem("pawnData", JSON.stringify(pawnData));
}

const disabledSquares = [4, 9, 11, 13, 15, 16, 18, 20, 21];

// Function to handle what happens when the player lands on a square
function handleSquareEvent(squareIndex) {

  // Show square description immediately
  descriptionBox.textContent = squareDescriptions[squareIndex];

  // Ensure buttons are always visible
  document.getElementById('accept-btn').style.visibility = 'visible';
  document.getElementById('reject-btn').style.visibility = 'visible';

  // If on a disabled square, grey out buttons
  if (disabledSquares.includes(squareIndex)) {
    document.getElementById('accept-btn').disabled = true;
    document.getElementById('reject-btn').disabled = true;
  } else {
    // Enable buttons for decision
    document.getElementById('accept-btn').disabled = false;
    document.getElementById('reject-btn').disabled = false;

    // Button logic
    acceptBtn.onclick = () => handleTokenDecision(true, squareIndex);
    rejectBtn.onclick = () => handleTokenDecision(false, squareIndex);
  }

  // Show square description immediately
  descriptionBox.textContent = squareDescriptions[squareIndex];
  // Log for debugging purposes
  console.log(`Pawn has landed on square ${squareIndex + 1}`);

  // Special case for Square 1 (start point)
  if (squareIndex === 0) {
    decisionButtons.style.display = 'none'; // Hide buttons if player is at the start
    return; // No further actions for square 1
  }

  // Handle special squares (8, 12, 19) with mini-game rewards
  if (squareIndex === 7) {
    decisionButtons.style.display = 'none'; // Hide buttons
    launchNewGame1(); // Launch New Game 1 for square 8
    return;
  } else if (squareIndex === 11) {
    decisionButtons.style.display = 'none'; // Hide buttons
    launchNewGame2(); // Launch New Game 2 for square 12
    return;
  } else if (squareIndex === 18) {
    decisionButtons.style.display = 'none'; // Hide buttons
    launchNewGame3(); // Launch New Game 3 for square 19
    return;
  }

  // Handle percentage penalty squares (Squares 4, 11, 15, 18)
  if ([3, 10, 14, 17].includes(squareIndex)) {
    handlePenaltySquare(squareIndex);
    return; // Stop further actions after handling penalty
  }

  // Handle percentage reward squares (Squares 9, 13, 16, 20, 21)
  if ([8, 12, 15, 19, 20].includes(squareIndex)) {
    handleRewardSquare(squareIndex);
    return; // Stop further actions after handling reward
  }

  // Handle fixed reward squares (with accept/reject)
  if ([1, 2, 4, 5, 6, 9, 13, 16, 21].includes(squareIndex)) {
    handleFixedRewardSquare(squareIndex);
    return; // Stop further actions after handling fixed reward
  }

  // Handle regular squares (excluding special, penalty, and reward squares)
  const currentSquareIndex = squareIndex; // Capture the current square index

  setTimeout(() => {
    // Exclude special squares, penalty squares, reward squares, and the end square
    if (![7, 11, 18, 3, 10, 14, 17, 8, 12, 15, 19, 20, 1, 2, 4, 5, 6, 9, 13, 16, 21].includes(currentSquareIndex)) {
      // Show the buttons for token spending decision
      decisionButtons.style.display = 'block'; // Show the Accept/Reject buttons

      // Add event listeners for Accept and Reject buttons
      acceptBtn.onclick = () => handleTokenDecision(true, currentSquareIndex);
      rejectBtn.onclick = () => handleTokenDecision(false, currentSquareIndex);
    } else {
      decisionButtons.style.display = 'none'; // Ensure buttons are hidden
      console.log(`No token prompt for square ${currentSquareIndex + 1}`);
    }

    // Update the token display and save the game state
    updateTokenDisplay();
    savePawnData();
  }, 200); // Slight delay for UI update
}



function handleFixedRewardSquare(squareIndex) {
  // Reset buttons and message
  decisionButtons.style.display = 'flex'; // Keep the buttons always visible (don't hide them)
  deactivateButtons(); // Ensure buttons are inactive initially

  // Determine the reward amount based on the square
  let rewardAmount = 0;
  if ([1, 2, 9].includes(squareIndex)) {
    rewardAmount = 20; // For Squares 2, 3, 10
  } else if (squareIndex === 4 || squareIndex === 5) {
    rewardAmount = 30; // For Squares 5, 6
  } else if (squareIndex === 6 || squareIndex === 21) {
    rewardAmount = 30; // For Squares 7, 22
  } else if (squareIndex === 13 || squareIndex === 16) {
    rewardAmount = 10; // For Squares 14, 17
  }

  // Show the buttons for reward acceptance
  // Enable buttons for decision
  activateButtons();

  // Add event listeners for Accept and Reject buttons
  acceptBtn.onclick = () => {
    if (pawnData.tokens >= rewardAmount) {
      pawnData.tokens -= rewardAmount; // Deduct from Initial Tokens
      pawnData.spentTokens += rewardAmount; // Add to Circular Tokens
    } else {
    }
    deactivateButtons(); // Disable buttons after decision
    updateTokenDisplay();
    savePawnData();

    // Check if the square is Square 22 and end the game
    if (squareIndex === 21) {
      setTimeout(() => {
        gameMessage.textContent += ' You have reached the end of the game!';
        diceRolling = false; // Stop rolling further
        endGame(); // Trigger end game logic
      }, 500); // Delay to allow message to update
    }
  };

  rejectBtn.onclick = () => {

    deactivateButtons(); // Disable buttons after decision
    updateTokenDisplay();
    savePawnData();

    // Check if the square is Square 22 and end the game
    if (squareIndex === 21) {
      setTimeout(() => {
        gameMessage.textContent += ' You have reached the end of the game!';
        diceRolling = false; // Stop rolling further
        endGame(); // Trigger end game logic
      }, 500); // Delay to allow message to update
    }
  };
}

// Function to activate the buttons
function activateButtons() {
  acceptBtn.classList.add('active');
  rejectBtn.classList.add('active');
  acceptBtn.disabled = false;
  rejectBtn.disabled = false;
}

// Function to deactivate the buttons
function deactivateButtons() {
  acceptBtn.classList.remove('active');
  rejectBtn.classList.remove('active');
  acceptBtn.disabled = true;
  rejectBtn.disabled = true;
}


function handleRewardSquare(squareIndex) {
  // Hide the decision buttons
  decisionButtons.style.display = 'none';

  let rewardPercentage = 0;

  // Determine the reward percentage based on the square
  if (squareIndex === 8 || squareIndex === 12 || squareIndex === 20) {
    rewardPercentage = 0.20; // 20% reward
  } else if (squareIndex === 15) { // Square 16
    rewardPercentage = 0.10; // 10% reward
  } else if (squareIndex === 19) { // Square 20
    rewardPercentage = 0.30; // 30% reward
  }

  // Calculate the reward amount based on Circular Tokens
  const rewardAmount = Math.floor(pawnData.spentTokens * rewardPercentage);

  // Add the reward to the player's Circular Tokens
  pawnData.spentTokens += rewardAmount;

  // Update the game message
  // Update the token display and save the game state
  updateTokenDisplay();
  savePawnData();
}



function handlePenaltySquare(squareIndex) {
  // Hide the decision buttons
  decisionButtons.style.display = 'none';

  let penaltyPercentage = 0;

  // Determine the penalty percentage based on the square
  if (squareIndex === 3) { // Square 4
    penaltyPercentage = 0.40; // 40% penalty
  } else if ([10, 14, 17].includes(squareIndex)) {
    penaltyPercentage = 0.10; // 10% penalty
  }

  // Calculate the penalty amount based on Circular Tokens
  const penaltyAmount = Math.floor(pawnData.spentTokens * penaltyPercentage);

  // Deduct the penalty from the player's Circular Tokens
  pawnData.spentTokens -= penaltyAmount;

  // Ensure tokens do not go negative
  if (pawnData.spentTokens < 0) {
    pawnData.spentTokens = 0;
  }

  // Update the game message
  // Update the token display and save the game state
  updateTokenDisplay();
  savePawnData();
}



// Function to handle token decision when Accept/Reject is clicked
function handleTokenDecision(accept, squareIndex) {
  if (accept && pawnData.tokens >= tokenPrice) {
    // Player accepts and has enough tokens, spend 5 tokens
    pawnData.tokens -= tokenPrice; // Deduct 5 tokens from Initial Circular Token
    pawnData.spentTokens += tokenPrice; // Add 5 tokens to Circular Token

  } else if (!accept) {
    // Player rejects
    gameMessage.textContent += ` You chose not to spend tokens.`;
  } else {
    // Player tries to accept but doesn't have enough tokens
    gameMessage.textContent += ` You don't have enough tokens to spend.`;
  }

  // Hide the decision buttons after a decision is made
  decisionButtons.style.display = 'none';

  // Update the token display and save the game state
  updateTokenDisplay();
  savePawnData();
}

// Function to launch the new game for Square 8
function launchNewGame1() {
  console.log("Launching New Game 1"); // Debugging log
  savePawnData(); // Save the pawn's current state before redirecting

  // Use a small delay to ensure the pawn data is saved before redirecting
  setTimeout(() => {
    window.location.href = "newGame1.html"; // Redirect to the new game for Square 8
  }, 500); // Delay for half a second to allow UI updates
}

// Function to launch the new game for Square 12
function launchNewGame2() {
  console.log("Launching New Game 2"); // Debugging log
  savePawnData(); // Save the pawn's current state before redirecting

  // Use a small delay to ensure the pawn data is saved before redirecting
  setTimeout(() => {
    window.location.href = "newGame2.html"; // Redirect to the new game for Square 12
  }, 500); // Delay for half a second to allow UI updates
}

// Function to launch the new game for Square 19
function launchNewGame3() {
  console.log("Launching New Game 3"); // Debugging log
  savePawnData(); // Save the pawn's current state before redirecting

  // Use a small delay to ensure the pawn data is saved before redirecting
  setTimeout(() => {
    window.location.href = "newGame3.html"; // Redirect to the new game for Square 19
  }, 500); // Delay for half a second to allow UI updates
}

document.addEventListener('DOMContentLoaded', () => {
  let savedData = localStorage.getItem('pawnData');

  if (savedData) {
    pawnData = JSON.parse(savedData);
    console.log('Resuming game with saved pawnData:', pawnData);

    // Check if the game has ended based on pawn position
    if (pawnData.position >= totalSquares - 1) {
      console.log('Game has ended previously. Resetting game state.');
      pawnData = { position: 0, tokens: 100, spentTokens: 0 };
      savePawnData();
      gameMessage.textContent = `Game has been reset. Your current tokens: ${pawnData.tokens}. Roll the dice to begin!`;
    } else if ([7, 11, 18].includes(pawnData.position)) {
      // Automatically award 20 tokens if returning from a mini-game
      pawnData.spentTokens += specialSquareTokenValue; // Award 20 tokens
      savePawnData();
    } else {
      //gameMessage.textContent = 'Roll the dice to continue!';
    }
  } else {
    // If no saved data, initialize the game with default values (new game)
    pawnData = { position: 0, tokens: 100, spentTokens: 0 };
    savePawnData(); // Save the default state to localStorage
    gameMessage.textContent = `Game has started. Your current tokens: ${pawnData.tokens}. Roll the dice to begin!`;
  }

  // Move the pawn to its saved position (from storage or start at 0)
  console.log('Moving pawn to saved or default position:', pawnData.position);
  movePawnToSquare(pawnData.position); // Confirm it's moving the pawn

  updateTokenDisplay();

  // Set square numbers
  setSquareNumbers();

  // Add icons to squares
  addIconsToSquares();
});


// Add event listener to the roll dice button
rollDiceBtn.addEventListener('click', rollDice);


// Function to end the game and reset the game state
function endGame() {
  if (!gameEnded) {
    console.log("Game is ending. Final token balance:", pawnData.spentTokens); // Debug log
    gameEnded = true; // Set the gameEnded flag to true

    // Calculate the percentage based on the maximum possible tokens (414)
    const maxTokens = 414;
    const percentage = ((pawnData.spentTokens / maxTokens) * 100).toFixed(2); // Calculate percentage and round to 2 decimal places

    // Display a final game message or perform any necessary end-game tasks
    alert(`You've reached the end of the game! Your final circular token balance is: ${pawnData.spentTokens}. 
    Your city and buildings are now ${percentage}% more circular! Good try!`);

    // Remove pawnData from localStorage to reset the game on reload
    localStorage.removeItem('pawnData');

    // Reset in-memory pawnData
    pawnData = { position: 0, tokens: 100, spentTokens: 0 };

    // Save the reset pawnData to localStorage
    savePawnData(); // Important: Save the reset data

    // Move the pawn back to start and update displays
    movePawnToSquare(0);
    updateTokenDisplay();


    // Reset game flags
    diceRolling = false;
    gameEnded = false;

    // Redirect to the game-over page after a short delay (if applicable)
    setTimeout(() => {
      console.log("Redirecting to game-over.html"); // Debug log
      window.location.href = "game-over.html"; // Redirect to the game-over page
    }, 2000); // 2-second delay
  }
}




function resetGame() {
  // Confirm with the player before resetting
  const confirmReset = confirm('Are you sure you want to reset the game? This will erase all progress.');
  if (!confirmReset) {
    return; // Player canceled the reset
  }

  // Clear pawnData to initial values
  pawnData = {
    position: 0,          // Starting position
    tokens: 100,          // Initial Tokens
    spentTokens: 0        // Circular Tokens
    // Remove innovationTokens if not used
  };

  // Remove pawnData from localStorage (optional, since we'll overwrite it)
  // localStorage.removeItem('pawnData');

  // Reset any other game state variables
  gameEnded = false;
  diceRolling = false;

  // Update the UI elements
  movePawnToSquare(pawnData.position);
  updateTokenDisplay();
  descriptionBox.textContent = '';

  // Hide decision buttons
  decisionButtons.style.display = 'none';

  // Save the reset pawnData to localStorage
  savePawnData();

  // Reset the timer as well
  resetTimer();
}


// Get the reset button element
const resetButton = document.getElementById('reset-game');

// Attach the event listener
resetButton.addEventListener('click', resetGame);


// Timer variables
let timerInterval;
let secondsElapsed = 0;

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000); // Timer increments every second
}

// Function to update the timer display
function updateTimerDisplay() {
  const timerElement = document.getElementById('timer');
  const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
  const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
  timerElement.textContent = `Time: ${minutes}:${seconds}`;
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timerInterval); // Stop the current timer
  secondsElapsed = 0; // Reset the time to 0
  updateTimerDisplay(); // Update the display to show 00:00
  startTimer(); // Restart the timer
}

// Start the timer when the page loads
window.onload = function () {
  startTimer(); // Begin the timer when the page loads
};

