const passwords = {
    game1: "password1",
    game2: "password2",
    game3: "password3",
    game4: "password4"
};

function requestPassword(game) {
    const enteredPassword = prompt("Please enter the password for " + game);
    if (enteredPassword === passwords[game]) {
        // Redirect to the respective game HTML page
        window.location.href = game + ".html";
    } else {
        alert("Incorrect password. Try again.");
    }
}
