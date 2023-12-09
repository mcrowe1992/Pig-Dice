function generateRandomValue(minValue:number, maxValue:number):number{
    var random = Math.random();
    
    //TODO: use random to generate a number between min and max

    return random;
}


function changePlayers():void{
    let currentPlayerName = (<HTMLElement>document.getElementById("current")).innerText;
    let player1Name = (<HTMLInputElement>document.getElementById("player1")).value;
    let player2Name = (<HTMLInputElement>document.getElementById("player2")).value;

    //swap from player to player by comparing current name to player names
    //set currentPlayerName to the next player
}

window.onload = function(){
    let newGameBtn = document.getElementById("new_game") as HTMLButtonElement;
    newGameBtn.onclick = createNewGame;

    (<HTMLButtonElement>document.getElementById("roll")).onclick = rollDie;

    (<HTMLButtonElement>document.getElementById("hold")).onclick = holdDie;
}

function createNewGame(): void {
    const player1Name = (<HTMLInputElement>document.getElementById("player1")).value;
    const player2Name = (<HTMLInputElement>document.getElementById("player2")).value;

    if (!player1Name || !player2Name) {
        alert("Both players must have a name!");
        return;
    }

    // Start the game with the entered player names
    const game = new PigDiceGame(player1Name, player2Name);

    // Set the PigDiceGame instance as a data attribute
    (<any>window).pigDiceGame = game;

    // Display the current player's turn
    const turnElement = <HTMLElement>document.getElementById("turn");
    turnElement.classList.add("open");
    const currentTurn = <HTMLElement>document.getElementById("current");
    currentTurn.innerText = game.getCurrentPlayer().name;

    // Unlock player name inputs
    (<HTMLInputElement>document.getElementById("player1")).removeAttribute("disabled");
    (<HTMLInputElement>document.getElementById("player2")).removeAttribute("disabled");

    // Reset scores on the form
    (<HTMLInputElement>document.getElementById("score1")).value = "0";
    (<HTMLInputElement>document.getElementById("score2")).value = "0";

    // Reset current and die values on the form
    (<HTMLInputElement>document.getElementById("total")).value = "0";
    (<HTMLInputElement>document.getElementById("die")).value = "";

}

function rollDie(): void {
    const currentTotal = parseInt((<HTMLInputElement>document.getElementById("total")).value);
    const game = getCurrentGame();

    // Roll the die and get a random value 1 - 6
    const rollValue = Math.floor(Math.random() * 6) + 1;

    if (rollValue === 1) {
        // If the roll is 1, change players and set current total to 0
        game.currentTurnTotal = 0;
        changePlayers();
    } else {
        // If the roll is greater than 1, add roll value to current total
        game.currentTurnTotal += rollValue;
    }

    // Set the die roll to the value player rolled
    (<HTMLInputElement>document.getElementById("die")).value = rollValue.toString();
    
    // Display current total on the form
    (<HTMLInputElement>document.getElementById("total")).value = game.currentTurnTotal.toString();
}

function holdDie(): void {
    const game = getCurrentGame();
    const currentPlayer = game.getCurrentPlayer();

    // Add the current turn total to the player's total score
    currentPlayer.score += game.currentTurnTotal;

    // Reset the turn total to 0
    game.currentTurnTotal = 0;

    // Change players
    changePlayers();

    // Update scores on the form
    updateScores();
}

function getCurrentGame(): PigDiceGame {
    // Retrieve the game instance from the data attribute
    return (<any>window).pigDiceGame;
}

function updateScores(): void {
    const game = getCurrentGame();
    const player1Score = <HTMLInputElement>document.getElementById("score1");
    const player2Score = <HTMLInputElement>document.getElementById("score2");

    // Update scores on the form
    player1Score.value = game.players[0].score.toString();
    player2Score.value = game.players[1].score.toString();
}

class Player {
    name: string;
    score: number;

    constructor(name: string) {
        this.name = name;
        this.score = 0;
    }
}

class PigDiceGame {
    players: Player[];
    currentPlayerIndex: number;
    currentTurnTotal: number;

    constructor(player1: string, player2: string) {
        this.players = [new Player(player1), new Player(player2)];
        this.currentPlayerIndex = 0;
        this.currentTurnTotal = 0;
    }

    getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    switchPlayer(): void {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }
}