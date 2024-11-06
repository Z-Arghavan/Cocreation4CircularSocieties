const passwords = {
    game1: "4444",
    game5: "5.6037N,0.1870W",
    game3: "3338",
    landingR: "3R"
  };
  
  // Custom prompt messages for each game
  const promptMessages = {
    game1: "If I am one digit, type four of me:",
    game5: "(x.xxxxX,x.xxxxX):",
    game3: "if you arrived to a range of numbers for your rating, enter all four digits",
    newGame1: "did you find the passowrd? :p"
  };
  
  // Custom incorrect password messages for each game
  const incorrectPasswordMessages = {
    game1: "Oops! That's not the correct password for Game 1. Try again.",
    game5: "Incorrect coordinates. Please check and enter again for Game 5.",
    game3: "The password you entered for Game 3 is incorrect. Please retry.",
    newGame1: "Invalid code for New Game 1. Please re-enter the correct code."
  };

  function requestPassword(game) {
    // Use the custom prompt message for the game, or a default message if not defined
    const promptMessage = promptMessages[game] || "Please enter the password:";
    const enteredPassword = prompt(promptMessage);
  
    if (enteredPassword === passwords[game]) {
      // Redirect to the respective game HTML page
      window.location.href = game + ".html";
    } else {
      // Use the custom incorrect password message, or a default message if not defined
      const incorrectMessage = incorrectPasswordMessages[game] || "Incorrect password. Try again.";
      alert(incorrectMessage);
    }
  }
    