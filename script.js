// =============================================
// GET ALL HTML ELEMENTS
// =============================================

const landingScreen  = document.getElementById("landing-screen");
const setupScreen    = document.getElementById("setup-screen");
const gameScreen     = document.getElementById("game-screen");

const enterBtn       = document.getElementById("enter-btn");
const nameP1         = document.getElementById("name-p1");
const nameP2         = document.getElementById("name-p2");
const startBtn       = document.getElementById("start-btn");
const nameError      = document.getElementById("name-error");

const turnMark       = document.getElementById("turn-mark");
const turnName       = document.getElementById("turn-name");
const cells          = document.querySelectorAll(".cell");

const restartBtn     = document.getElementById("restart-btn");
const newGameBtn     = document.getElementById("new-game-btn");
const exitBtn        = document.getElementById("exit-btn");

const resultPopup    = document.getElementById("result-popup");
const resultText     = document.getElementById("result-text");
const playAgainBtn   = document.getElementById("play-again-btn");
const resultNewGame  = document.getElementById("result-new-game-btn");
const resultClose    = document.getElementById("result-close-btn");

const themeBtns      = document.querySelectorAll(".theme-btn");
const musicPopup     = document.getElementById("music-popup");
const enterWithMusic = document.getElementById("enter-with-music");
const enterNoMusic   = document.getElementById("enter-no-music");
const trackBtns      = document.querySelectorAll(".track-btn");
const musicBtn       = document.getElementById("music-btn");

// =============================================
// SOUND EFFECTS
// (put these files in a sounds/ folder)
// =============================================

const sounds = {
    click:   new Audio("sounds/click.mp3"),
    place:   new Audio("sounds/place.mp3"),
    win:     new Audio("sounds/win.mp3"),
    draw:    new Audio("sounds/draw.mp3"),
    restart: new Audio("sounds/restart.mp3")
};

// Play a sound by name
function playSound(name) {
    sounds[name].currentTime = 0;
    sounds[name].play().catch(() => {});
}

// =============================================
// BACKGROUND MUSIC
// (put these files in a music/ folder)
// =============================================

const musicTracks = {
    lofi:  "music/lofi.mp3",
    retro: "music/retro.mp3",
    hype:  "music/hype.mp3",
    calm:  "music/calm.mp3"
};

const bgMusic    = new Audio();
bgMusic.loop     = true;
bgMusic.volume   = 0.4;

let selectedTrack = "lofi";  // default track
let isMusicOn     = false;

function startMusic() {
    bgMusic.src = musicTracks[selectedTrack];
    bgMusic.play().catch(() => {});
    isMusicOn = true;
    updateMusicBtn();
}

function toggleMusic() {
    if (isMusicOn) {
        bgMusic.pause();
        isMusicOn = false;
    } else {
        bgMusic.play().catch(() => {});
        isMusicOn = true;
    }
    updateMusicBtn();
}

// Update the music button icon based on music state
function updateMusicBtn() {
    musicBtn.textContent = isMusicOn ? "🎵" : "🔇";
    musicBtn.classList.toggle("muted", !isMusicOn);
}

// =============================================
// MUSIC POPUP LOGIC
// =============================================

// Highlight the first track by default
trackBtns[0].classList.add("selected");

// When a track is clicked, highlight it and save selection
trackBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        trackBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedTrack = btn.dataset.track;
    });
});

// User clicks "Enter with Music"
enterWithMusic.addEventListener("click", () => {
    musicPopup.classList.add("hidden");
    musicBtn.classList.remove("hidden");
    startMusic();
    showScreen(landingScreen);
});

// User clicks "No Music"
enterNoMusic.addEventListener("click", () => {
    musicPopup.classList.add("hidden");
    musicBtn.classList.remove("hidden");
    updateMusicBtn();
    showScreen(landingScreen);
});

// Toggle music on/off
musicBtn.addEventListener("click", () => {
    if (!selectedTrack) return;
    toggleMusic();
});

// =============================================
// GAME STATE VARIABLES
// =============================================

let board         = Array(9).fill("");  // 9 empty cells
let currentPlayer = "X";               // X always goes first
let gameActive    = false;             // is the game running?
let player1Name   = "";
let player2Name   = "";

// All possible winning combinations (by cell index)
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
    [0, 4, 8], [2, 4, 6]               // diagonals
];

// =============================================
// HELPER FUNCTIONS
// =============================================

// Hide all screens, then show the one we want
function showScreen(screen) {
    [landingScreen, setupScreen, gameScreen].forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
}

// Apply dark or light theme
function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("tttTheme", theme);
    themeBtns.forEach(b => b.classList.toggle("active", b.dataset.theme === theme));
}

// Update the "whose turn" display
function updateTurnInfo() {
    const name = currentPlayer === "X" ? player1Name : player2Name;
    turnMark.textContent = currentPlayer;
    turnMark.className   = "turn-letter " + (currentPlayer === "X" ? "color-x" : "color-o");
    turnName.textContent = name + "'s Turn";
}

// Reset the board for a new round (same players)
function resetBoard() {
    board         = Array(9).fill("");
    currentPlayer = "X";
    gameActive    = true;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled    = false;
        cell.classList.remove("win", "pop");
    });

    updateTurnInfo();
}

// Check if anyone has won — returns winning indexes or null
function checkWinner() {
    for (const [a, b, c] of winPatterns) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return [a, b, c];
        }
    }
    return null;
}

// Stop the game and show the result popup
function endGame(message) {
    gameActive = false;
    cells.forEach(cell => cell.disabled = true);
    resultText.textContent = message;
    resultPopup.classList.remove("hidden");
}

// =============================================
// THEME
// =============================================

themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        playSound("click");
        applyTheme(btn.dataset.theme);
    });
});

// Load saved theme or default to dark
applyTheme(localStorage.getItem("tttTheme") || "dark");

// =============================================
// LANDING SCREEN
// =============================================

enterBtn.addEventListener("click", () => {
    playSound("click");
    showScreen(setupScreen);
});

// =============================================
// SETUP SCREEN
// =============================================

startBtn.addEventListener("click", () => {
    const n1 = nameP1.value.trim();
    const n2 = nameP2.value.trim();

    // Show error if either name is empty
    if (!n1 || !n2) {
        nameError.classList.remove("hidden");
        return;
    }

    nameError.classList.add("hidden");
    player1Name = n1;
    player2Name = n2;

    playSound("click");
    resetBoard();
    showScreen(gameScreen);
});

// Allow pressing Enter on name field to start
nameP2.addEventListener("keydown", e => {
    if (e.key === "Enter") startBtn.click();
});

// =============================================
// GAME BOARD — CELL CLICKS
// =============================================

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = Number(cell.dataset.index);

        // Ignore click if game is over or cell already filled
        if (!gameActive || board[index]) return;

        // Place the current player's mark
        board[index]      = currentPlayer;
        cell.textContent  = currentPlayer;
        cell.classList.add("pop");
        playSound("place");

        // Check for a winner
        const winIndexes = checkWinner();
        if (winIndexes) {
            winIndexes.forEach(i => cells[i].classList.add("win"));
            playSound("win");
            const winner = currentPlayer === "X" ? player1Name : player2Name;
            endGame(winner + " Wins! 🎉");
            return;
        }

        // Check for a draw (no empty cells left)
        if (!board.includes("")) {
            playSound("draw");
            endGame("It's a Draw! 🤝");
            return;
        }

        // Switch to the other player
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnInfo();
    });
});

// =============================================
// GAME CONTROL BUTTONS
// =============================================

// Restart: same players, reset board
function restartGame() {
    resultPopup.classList.add("hidden");
    playSound("restart");
    resetBoard();
}

// New Game: go back to name setup
function goToNewGame() {
    resultPopup.classList.add("hidden");
    nameP1.value = "";
    nameP2.value = "";
    playSound("restart");
    showScreen(setupScreen);
}

// Exit: close the tab
function exitGame() {
    playSound("click");
    if (confirm("Exit?")) {
        window.close();
        setTimeout(() => alert("Please close the tab manually."), 300);
    }
}

restartBtn.addEventListener("click", restartGame);
playAgainBtn.addEventListener("click", restartGame);

newGameBtn.addEventListener("click", goToNewGame);
resultNewGame.addEventListener("click", goToNewGame);

exitBtn.addEventListener("click", exitGame);
resultClose.addEventListener("click", exitGame);