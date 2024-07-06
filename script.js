const message = document.querySelector(".portrait-message");
const container = document.querySelector(".container");
window.matchMedia("(orientation: portrait)").onchange = checkOrientation;


function isSmallScreen() {
    return window.screen.width < 768;
}

function checkOrientation() {
    if (isSmallScreen() && window.matchMedia("(orientation: portrait)").matches) {
        message.classList.remove("inactive");
        container.classList.add("inactive");
    }
    else {
        message.classList.add("inactive");
        container.classList.remove("inactive");
    }
}

checkOrientation();

const targetScore = 100;
const newGame = document.querySelector(".new-game");
const diceImage = document.querySelector(".dice-image");
const rollDice = document.querySelector(".roll-dice");
const hold = document.querySelector(".hold");

const player1 = document.querySelector(".player.p-1");
const player2 = document.querySelector(".player.p-2");
const totalScoreP1 = document.querySelector(".totalScore.p-1");
const totalScoreP2 = document.querySelector(".totalScore.p-2");
const currentScoreP1 = document.querySelector(".currentScore.p-1");
const currentScoreP2 = document.querySelector(".currentScore.p-2");

let active = { value: null };
let activePlayer = null;

active = new Proxy(active, {
    set(target, property, value) {
        target[property] = value;
        updateActive();
        return true;
    }
})

function updateActive() {
    activePlayer = players[active.value];
    activePlayer.card.classList.add("active");
    players[1 - active.value].card.classList.remove("active");
}

let players = [{
    name: "Player 1",
    card: player1,
    totalScore: 0,
    currentScore: 0
}, {
    name: "Player 2",
    card: player2,
    totalScore: 0,
    currentScore: 0
}]

function updateGame() {
    totalScoreP1.textContent = players[0].totalScore;
    totalScoreP2.textContent = players[1].totalScore;
    currentScoreP1.textContent = players[0].currentScore;
    currentScoreP2.textContent = players[1].currentScore;
}

// Function to create a Proxy for a player object
function createPlayerProxy(player) {
    return new Proxy(player, {
        set(target, property, value) {
            target[property] = value;
            updateGame();
            return true;
        }
    });
}

// Wrap each player object in the players array with a Proxy
players = players.map(createPlayerProxy);
newGame.addEventListener("click", initializeGame);

function initializeGame() {
    rollDice.removeAttribute("disabled");
    hold.removeAttribute("disabled");
    players[0].totalScore = 0;
    players[1].totalScore = 0;
    players[0].currentScore = 0;
    players[1].currentScore = 0;
    player1.classList.remove("winner", "active", "loser");
    player2.classList.remove("winner", "active", "loser");
    active.value = 0;
}

rollDice.addEventListener("click", () => {
    const dice = Math.floor(Math.random() * 6) + 1;
    diceImage.src = `images/dice-${dice}.png`;
    diceImage.classList.remove("hidden");
    if (dice === 1) {
        activePlayer.currentScore = 0;
        active.value = 1 - active.value;
    } else {
        activePlayer.currentScore += dice;
    }
});

hold.addEventListener("click", () => {
    activePlayer.totalScore += activePlayer.currentScore;
    activePlayer.currentScore = 0;

    if (activePlayer.totalScore >= targetScore)
        return winner();
    active.value = 1 - active.value;
});

function winner() {
    activePlayer.card.classList.add("winner");
    activePlayer.currentScore = 'Winner!';
    players[1 - active.value].card.classList.add("loser");
    rollDice.setAttribute("disabled", true);
    hold.setAttribute("disabled", true);
}

