function generateRandomValue(minValue, maxValue) {
    var random = Math.random();
    //TODO: use random to generate a number between min and max
    return random;
}

function changePlayers() {
    const currentPlayerName = document.getElementById("current").innerText;
    const player1Name = document.getElementById("player1").value;
    const player2Name = document.getElementById("player2").value;

    // Check if the current player is Player 1
    if (currentPlayerName === player1Name) {
        document.getElementById("current").innerText = player2Name;
    } else {
        // If not, switch to Player 1
        document.getElementById("current").innerText = player1Name;
    }
}

window.onload = function () {
    console.log("Window loaded.");
    var newGameBtn = document.getElementById("new_game");
    newGameBtn.onclick = createNewGame;
};

function createNewGame() {
    console.log("Creating a new game...");
    var player1Input = document.getElementById("player1");
    var player2Input = document.getElementById("player2");
    var player1Name = player1Input.value;
    var player2Name = player2Input.value;

    if (!player1Name || !player2Name) {
        alert("Both players must have a name!");
        return;
    }

    // Start the game with the entered player names
    var game = new PigDiceGame(player1Name, player2Name);

    // Set the PigDiceGame instance as a data attribute
    window.pigDiceGame = game;

    // Display the current player's turn
    var turnElement = document.getElementById("turn");
    turnElement.classList.add("open");

    // Unlock player name inputs
    player1Input.removeAttribute("disabled");
    player2Input.removeAttribute("disabled");

    // Reset scores on the form
    document.getElementById("score1").value = "0";
    document.getElementById("score2").value = "0";

    // Reset current and die values on the form
    document.getElementById("total").value = "0";
    document.getElementById("die").value = "";

    // Set the initial player's turn
    var currentTurn = document.getElementById("current");
    currentTurn.innerText = game.getCurrentPlayer().name;

    // Continue your existing code...
}

window.onload = function () {
    console.log("Window loaded.");

    let newGameBtn = document.getElementById("new_game");
    newGameBtn.onclick = createNewGame;

    let rollBtn = document.getElementById("roll");
    rollBtn.onclick = rollDie;

    let holdBtn = document.getElementById("hold");
    holdBtn.onclick = holdDie;
};


function rollDie() {
    var currentTotal = parseInt(document.getElementById("total").value);
    var game = getCurrentGame();

    // Roll the die and get a random value 1 - 6
    var rollValue = Math.floor(Math.random() * 6) + 1;

    if (rollValue === 1) {
        // If the roll is 1, change players and set current total to 0
        game.currentTurnTotal = 0;
        changePlayers();
    } else {
        // If the roll is greater than 1, add roll value to current total
        game.currentTurnTotal += rollValue;
    }

    // Set the die roll to the value player rolled
    document.getElementById("die").value = rollValue.toString();

    // Display current total on the form
    document.getElementById("total").value = game.currentTurnTotal.toString();
}

function holdDie() {
    var game = getCurrentGame();
    var currentPlayer = game.getCurrentPlayer();

    // Add the current turn total to the player's total score
    currentPlayer.score += game.currentTurnTotal;

    // Reset the turn total to 0
    game.currentTurnTotal = 0;

    // Change players
    changePlayers();

    // Update scores on the form
    updateScores();
}

function getCurrentGame() {
    // Retrieve the game instance from the data attribute
    return window.pigDiceGame;
}

function updateScores() {
    var game = getCurrentGame();
    var player1Score = document.getElementById("score1");
    var player2Score = document.getElementById("score2");

    // Update scores on the form
    player1Score.value = game.players[0].score.toString();
    player2Score.value = game.players[1].score.toString();
}

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }
}

class PigDiceGame {
    constructor(player1Name, player2Name) {
        this.players = [new Player(player1Name), new Player(player2Name)];
        this.currentPlayerIndex = 0;
        this.currentTurnTotal = 0;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }

    rollDie() {
        var rollValue = Math.floor(Math.random() * 6) + 1;

        if (rollValue === 1) {
            this.currentTurnTotal = 0;
            this.switchPlayer();
        } else {
            this.currentTurnTotal += rollValue;
        }

        return rollValue;
    }

    holdDie() {
        var currentPlayer = this.getCurrentPlayer();
        currentPlayer.score += this.currentTurnTotal;
        this.currentTurnTotal = 0;
        this.switchPlayer();
    }
}