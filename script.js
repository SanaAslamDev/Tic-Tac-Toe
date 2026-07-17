const landingScreen = document.getElementById("landing-screen");
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");

const enterBtn = document.getElementById("enter-btn");
const startBtn = document.getElementById("start-btn");

const nameP1 = document.getElementById("name-p1");
const nameP2 = document.getElementById("name-p2");

const nameError = document.getElementById("name-error");

const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");

const turnMark = document.getElementById("turn-mark");
const turnName = document.getElementById("turn-name");

const restartBtn = document.getElementById("restart-btn");
const newGameBtn = document.getElementById("new-game-btn");
const exitBtn = document.getElementById("exit-btn");

const resultPopup = document.getElementById("result-popup");
const resultText = document.getElementById("result-text");

const playAgainBtn = document.getElementById("play-again-btn");
const resultNewGame = document.getElementById("result-new-game-btn");
const resultClose = document.getElementById("result-close-btn");

const musicPopup = document.getElementById("music-popup");
const enterWithMusic = document.getElementById("enter-with-music");
const enterNoMusic = document.getElementById("enter-no-music");
const musicBtn = document.getElementById("music-btn");

const sounds = {
    click: new Audio("sounds/click.mp3"),
    place: new Audio("sounds/place.mp3"),
    win: new Audio("sounds/win.mp3"),
    draw: new Audio("sounds/draw.mp3"),
    restart: new Audio("sounds/restart.mp3")
};

Object.values(sounds).forEach(sound => {
    sound.preload = "auto";
});

function playSound(name){
    if(!sounds[name]) return;
    try{
        sounds[name].currentTime = 0;
        sounds[name].play().catch(()=>{});
    }catch(err){
        // ignore playback errors (e.g. file missing / not yet loaded)
    }
}

const bgMusic = new Audio("sounds/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.35;
let isMusicOn = false;

function updateMusicBtn(){
    musicBtn.textContent = isMusicOn ? "🎵" : "🔇";
    musicBtn.classList.toggle("muted", !isMusicOn);
}

function startMusic(){
    bgMusic.play().catch(()=>{});
    isMusicOn = true;
    updateMusicBtn();
}

function stopMusic(){
    bgMusic.pause();
    isMusicOn = false;
    updateMusicBtn();
}

function toggleMusic(){
    isMusicOn ? stopMusic() : startMusic();
}

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let player1Name = "";
let player2Name = "";

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function showScreen(screen){
    [landingScreen,setupScreen,gameScreen].forEach(section=>{
        section.classList.add("hidden");
    });
    requestAnimationFrame(()=>{
        screen.classList.remove("hidden");
    });
}

function updateTurnInfo(){
    const player = currentPlayer==="X" ? player1Name : player2Name;
    turnMark.textContent = currentPlayer;
    turnMark.className = `turn-letter ${currentPlayer==="X" ? "color-x" : "color-o"}`;
    turnName.textContent = `${player}'s Turn`;
}

function resetBoard(){
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    cells.forEach(cell=>{
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("win","pop");
    });
    updateTurnInfo();
}

function checkWinner(){
    for(const pattern of winPatterns){
        const [a,b,c] = pattern;
        if(board[a] && board[a]===board[b] && board[b]===board[c]){
            return pattern;
        }
    }
    return null;
}

function endGame(message){
    gameActive = false;
    cells.forEach(cell=>{ cell.disabled = true; });
    resultText.textContent = message;
    resultPopup.classList.remove("hidden");
}

function restartGame(){
    playSound("restart");
    resultPopup.classList.add("hidden");
    resetBoard();
}

function goToNewGame(){
    playSound("restart");
    resultPopup.classList.add("hidden");
    nameP1.value = "";
    nameP2.value = "";
    showScreen(setupScreen);
}

function exitGame(){
    playSound("click");
    if(confirm("Exit the game?")){
        window.close();
        setTimeout(()=>{ alert("Please close the browser tab manually."); },300);
    }
}

enterWithMusic.addEventListener("click",()=>{
    playSound("click");
    musicPopup.classList.add("hidden");
    musicBtn.classList.remove("hidden");
    startMusic();
    showScreen(landingScreen);
});

enterNoMusic.addEventListener("click",()=>{
    playSound("click");
    musicPopup.classList.add("hidden");
    musicBtn.classList.remove("hidden");
    stopMusic();
    showScreen(landingScreen);
});

musicBtn.addEventListener("click",toggleMusic);

enterBtn.addEventListener("click",()=>{
    playSound("click");
    showScreen(setupScreen);
});

startBtn.addEventListener("click",()=>{
    const n1 = nameP1.value.trim();
    const n2 = nameP2.value.trim();
    if(!n1 || !n2){
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

nameP2.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){ startBtn.click(); }
});

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = Number(cell.dataset.index);
        if (!gameActive || board[index]) return;

        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add("pop");
        playSound("place");

        setTimeout(() => { cell.classList.remove("pop"); }, 250);

        const winnerCells = checkWinner();

        if (winnerCells) {
            gameActive = false;
            cells.forEach(c => { c.disabled = true; });
            winnerCells.forEach(i => { cells[i].classList.add("win"); });
            const winnerName = currentPlayer === "X" ? player1Name : player2Name;
            playSound("win");
            setTimeout(() => { endGame(`🏆 ${winnerName} Wins!`); }, 700);
            return;
        }

        if (!board.includes("")) {
            gameActive = false;
            cells.forEach(c => { c.disabled = true; });
            playSound("draw");
            setTimeout(() => { endGame("🤝 It's a Draw!"); }, 500);
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnInfo();
    });
});

restartBtn.addEventListener("click", () => { restartGame(); });
playAgainBtn.addEventListener("click", () => { restartGame(); });
newGameBtn.addEventListener("click", () => { goToNewGame(); });
resultNewGame.addEventListener("click", () => { goToNewGame(); });
exitBtn.addEventListener("click", () => { exitGame(); });
resultClose.addEventListener("click", () => { exitGame(); });

showScreen(landingScreen);
updateMusicBtn();

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !resultPopup.classList.contains("hidden")) {
        resultPopup.classList.add("hidden");
    }
    if (e.key.toLowerCase() === "r" && gameScreen.classList.contains("hidden") === false) {
        restartGame();
    }
});

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-3px) scale(1.02)";
    });
    button.addEventListener("mouseleave", () => {
        button.style.transform = "";
    });
});