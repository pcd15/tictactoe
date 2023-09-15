// functions
function createGrid(dimensions) {
    for (let row = 0; row < dimensions; row++) {
        let newRow = document.createElement('div');
        newRow.classList.add('row');
        for (let col = 0; col < dimensions; col++) {
            let pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.setAttribute('id', counter.toString());
            newRow.appendChild(pixel);
            counter++;
        }
        grid.appendChild(newRow);
    }
    for (let i = 0; i < dimensions; i++) {
        board[i] = [];
    }
    for (let j = 0; j < dimensions; j++) {
        for (let k = 0; k < dimensions; k++) {
            board[j][k] = "";
        }
    }
    counter = 0;
    let pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => pixel.addEventListener('click', playerMove));   
}

async function playerMove() { 
    if (!running && turnOrder) {
        if (!gameover) {
            let num = parseInt(this.id);
            let row = Math.floor(num / dimensions);
            let col = num % dimensions;
            if (board[row][col] === "") {
                this.textContent = player;
                board[row][col] = player;
                running = true;
                await sleep(500);
                opponentMove();
                running = false;
            }
        }
    }
}

function checkWinner() {
    let winner = null;
    for (let i = 0; i < dimensions; i++) {
        if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) winner = board[i][0];
    }
    for (let i = 0; i < dimensions; i++) {
        if (board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i]) winner = board[0][i];
    }
    if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) winner = board[0][0];
    if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) winner = board[2][0];
    let open = 0;
    for (let i = 0; i < dimensions; i++) {
        for (let j = 0; j < dimensions; j++) {
            if (board[i][j] === "") open++;
        }
    }
    if (winner === null) {
        if (open === 0) return 0;
        else return winner;
    }
    else if (winner === player) return -1;
    else return 1;
}

function opponentMove() {
    let winner = checkWinner();
    if (winner !== null) {
        console.log(winner);
        gameover = true;
        endgame(winner);
    }
    else {
        let bestMove = 0;
        let bestScore = -Infinity;
        for (let row = 0; row < dimensions; row++) {
            for (let col = 0; col < dimensions; col++) {
                if (board[row][col] === "") {
                    board[row][col] = opponent;
                    let score = rec(board, true);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = (row * dimensions) + col;
                    }
                    board[row][col] = "";
                }
            }
        }
        let row = Math.floor(bestMove / dimensions);
        let col = bestMove % dimensions;
        board[row][col] = opponent;
        const pixel = document.getElementById(bestMove);
        pixel.textContent = opponent;
        let winner = checkWinner();
        if (winner !== null) {
            gameover = true;
            endgame(winner);
        }
    }
}

function rec(board, isPlayer) {
    let winner = checkWinner();
    if (winner !== null) {
        return winner;
    }
    else if (isPlayer) {
        let bestScore = Infinity;
        for (let row = 0; row < dimensions; row++) {
            for (let col = 0; col < dimensions; col++) {
                if (board[row][col] === "") {
                    board[row][col] = player;
                    let score = rec(board, false);
                    bestScore = Math.min(bestScore, score);
                    board[row][col] = "";
                }
            }
        }
        return bestScore;
    }
    else {
        let bestScore = -Infinity;
        for (let row = 0; row < dimensions; row++) {
            for (let col = 0; col < dimensions; col++) {
                if (board[row][col] === "") {
                    board[row][col] = opponent;
                    let score = rec(board, true);
                    bestScore = Math.max(bestScore, score);
                    board[row][col] = "";
                }
            }
        }
        return bestScore;
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function endgame(winner) {
    if (winner === 0) credits.appendChild(tie);
    else credits.appendChild(loser);
    credits.appendChild(playAgain);
}

function reset() {
    credits.innerHTML = null;
    selectedSymbol = null;
    selectedTurn = null;
    player = null;
    opponent = null;
    turnOrder = null;
    gameover = false;
    running = false;
    counter = 0;
    board = [];
    grid.innerHTML = null;
    display.innerHTML = null;
    display.appendChild(start);
}

const title = document.querySelector('#title');
const text = title.textContent;
const delay = 100;
let i = 0;

setInterval(() => {
    title.textContent = text.substring(0, i);
    i++;
    if (i == text.length) return;
}, delay);

async function setX() {
    // if (!selectedSymbol) {
        selectedSymbol = true;
        player = "X";
        opponent = "O";
        if (selectedTurn) {
            display.innerHTML = null;
            display.appendChild(tictactoe);
            createGrid(dimensions);
            if (!turnOrder) {
                await sleep(1000);
                opponentMove();
                turnOrder = true;
            }
        }
    // }
}

async function setO() {
    // if (!selectedSymbol) {
        selectedSymbol = true;
        player = "O";
        opponent = "X";
        if (selectedTurn) {
            display.innerHTML = null;
            display.appendChild(tictactoe);
            createGrid(dimensions);
            if (!turnOrder) {
                await sleep(1000);
                opponentMove();
                turnOrder = true;
            }
        }
    // }
}

function setFirst() {
    // if (!selectedTurn) {
        selectedTurn = true;
        turnOrder = true;
        if (selectedSymbol) {
            display.innerHTML = null;
            display.appendChild(tictactoe);
            createGrid(dimensions);
        }
    // }
}

async function setSecond() {
    // if (!selectedTurn) {
        selectedTurn = true;
        turnOrder = false;
        if (selectedSymbol) {
            display.innerHTML = null;
            display.appendChild(tictactoe);
            createGrid(dimensions);
            await sleep(1000);
            opponentMove();
            turnOrder = true;
        }
    // }
}

// parameters + other stuff
let player;
let opponent;
let gameover = false;
let dimensions = 3;
let counter = 0;
let board = [];
let running = false;
let turnOrder;
let selectedTurn = false;
let selectedSymbol = false;
let hasMoved = false;

// endgame stuff
const credits = document.querySelector('#credits');

const playAgain = document.createElement('button');
playAgain.classList.add('button');
playAgain.textContent = 'Play Again';
playAgain.addEventListener('click', reset);

const tie = document.createElement('h1');
tie.textContent = "You tied!";

const loser = document.createElement('h1');
loser.textContent = "You lost!";

// dark-mode stuff
let lightMode = true;
const toggle = document.querySelector('#toggle');
const header = document.querySelector('h1');
toggle.addEventListener('click', switchMode);

function switchMode() {
    lightMode = !lightMode;
    lightMode ? toggle.innerHTML = `<img src="img/sun.svg" alt="sun icon" class="icon">` : toggle.innerHTML = `<img src="img/moon.svg" alt="moon icon" class="icon">`;
    document.body.classList.toggle("dark_body");
    title.classList.toggle("dark_text");
    loser.classList.toggle("dark_text");
    tie.classList.toggle("dark_text");
    topSection.classList.toggle("dark_text");
    turn.classList.toggle("dark_group");
    symbol.classList.toggle("dark_group");
    turn_title.classList.toggle("dark_text");
    symbol_title.classList.toggle("dark_text");
}

let display = document.querySelector('#display');

// starting/selections page
let first = document.createElement('button');
first.textContent = "First";
first.classList.add("button");
first.classList.add("dark_button");
let second = document.createElement('button');
second.textContent = "Second";
second.classList.add("button");
second.classList.add("dark_button");
let turn_buttons = document.createElement('div');
turn_buttons.appendChild(first);
turn_buttons.appendChild(second);
turn_buttons.classList.add("mini_bottom");
let turn_title = document.createElement('div');
turn_title.textContent = "Turn";
turn_title.classList.add("mini_top");
let turn = document.createElement('div');
turn.appendChild(turn_title);
turn.appendChild(turn_buttons);
turn.classList.add("group");

let x = document.createElement('button');
x.textContent = "X";
x.classList.add("button");
x.classList.add("dark_button");
let o = document.createElement('button');
o.textContent = "O";
o.classList.add("button");
o.classList.add("dark_button");
let symbol_buttons = document.createElement('div');
symbol_buttons.append(x);
symbol_buttons.append(o);
symbol_buttons.classList.add("mini_bottom");
let symbol_title = document.createElement('div');
symbol_title.textContent = "Symbol";
symbol_title.classList.add("mini_top");
let symbol = document.createElement('div');
symbol.appendChild(symbol_title);
symbol.appendChild(symbol_buttons);
symbol.classList.add("group");

let bottomSection = document.createElement('div');
bottomSection.append(symbol);
bottomSection.append(turn);
bottomSection.classList.add("bottom");
let topSection = document.createElement('div');
topSection.textContent = "Select An Option For Each to Continue";
topSection.classList.add("top");

let start = document.createElement('div');
start.classList.add("start");
start.appendChild(topSection);
start.appendChild(bottomSection);
display.appendChild(start);

toggle.addEventListener('click', switchMode);
first.addEventListener('click', setFirst);
second.addEventListener('click', setSecond);
x.addEventListener('click', setX);
o.addEventListener('click', setO);

// tic-tac-toe board
let tictactoe = document.createElement('div');
tictactoe.classList.add('tictactoe');
let grid = document.createElement('div');
grid.setAttribute('id', "grid");
tictactoe.appendChild(grid);