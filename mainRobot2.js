const passwords = {
    game5: "4444",
    game3: "Relearn",
    game1: "17Goals",
    landgingR: "3R",
  };
  
  // Custom prompt messages for each game
  const promptMessages = {
    game5: "Password: 4444",
    game3: "Password: Relearn",
    game1: "Password: 17Goals",
    landingR: "Password: 3R",
  };
  
  // Custom incorrect password messages for each game
  const incorrectPasswordMessages = {
    game5: "Oops! That's not the correct password. Try again. (Hint: This password comes from the Earth Over Shoot Day challenge)",
    game3: "Incorrect . Please check and enter again. (Hint: This password comes from the Illegal Waste Trafficking challenge)",

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
    
