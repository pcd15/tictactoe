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
}

function playerMove() { 
    console.log(gameover);
    if (!gameover) {
        let num = parseInt(this.id);
        let row = Math.floor(num / dimensions);
        let col = num % dimensions;
        if (board[row][col] === "") {
            this.textContent = player;
            // this.style.fontSize = "140px";
            board[row][col] = player;
            opponentMove();
        }
    }
}
  
function checkWinner() {
    let winner = null;
  
    // horizontal
    for (let i = 0; i < dimensions; i++) {
        if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][2] === board[i][3] && board[i][3] === board[i][4]) {
            winner = board[i][0];
        }
    }
  
    // vertical
    for (let i = 0; i < dimensions; i++) {
        if (board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[2][i] === board[3][i] && board[3][i] === board[4][i]) {
            winner = board[0][i];
        }
    }
  
    // diagonal
    if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === board[3][3] && board[3][3] === board[4][4]) {
        winner = board[0][0];
    }
    if (board[0][4] !== "" && board[0][4] === board[1][3] && board[1][3] === board[2][2] && board[2][2] === board[3][1] && board[3][1] === board[4][0]) {
        winner = board[2][0];
    }
  
    // tie
    let open = 0;
    for (let i = 0; i < dimensions; i++) {
        for (let j = 0; j < dimensions; j++) {
            if (board[i][j] === "") {
                open++;
            }
        }
    }

    if (open === 0) return 0;
    if (winner === null) return winner;
    else if (winner === player) return -1;
    else return 1;
}

// this doesn't work.... it doesn't make the optimal move (maybe b/c of error in checkWinner()?)
function opponentMove() {
    let winner = checkWinner();
    if (winner !== null) {
        console.log(winner);
        gameover = true;
        // endgame(winner);
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
            // endgame(winner);
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

// this doesn't work.... it sets gameover too soon
// function checkWinner() {
//     let flag;
//     for (let row = 0; row < dimensions - 1; row++) {
//         flag = true;
//         for (let col = 0; col < dimensions - 1; col++) {
//             if (board[row][col] === "" || board[row][col] !== board[row][col + 1]) {
//                 flag = false;
//                 break;
//             }
//         }
//         if (flag) {
//             let winner = board[row][0];
//             if (winner === player) return -1;
//             else return 1;
//         }
//     }
//     for (let col = 0; col < dimensions - 1; col++) {
//         flag = true;
//         for (let row = 0; row < dimensions - 1; row++) {
//             if (board[row][col] === "" || board[row][col] !== board[row + 1][col]) {
//                 flag = false;
//                 break;
//             }
//         }
//         if (flag) {
//             let winner = board[0][col];
//             if (winner === player) return -1;
//             else return 1;
//         }
//     }
//     for (let row = 0; row < dimensions - 1; row++) {
//         flag = true;
//         for (let col = 0; col < dimensions - 1; col++) {
//             if (board[row][col] === "" || board[row][col] !== board[row + 1][col + 1]) {
//                 flag = false;
//                 break;
//             }
//         }
//         if (flag) {
//             let winner = board[0][0];
//             if (winner === player) return -1;
//             else return 1;
//         }
//     }
//     for (let row = 0; row < dimensions - 1; row++) {
//         flag = true;
//         for (let col = dimensions - 1; col >= 0; col--) {
//             if (board[row][col] === "" || board[row][col] !== board[row + 1][col - 1]) {
//                 flag = false;
//                 break;
//             }
//         }
//         if (flag) {
//             let winner = board[0][0];
//             if (winner === player) return -1;
//             else return 1;
//         }
//     }
//     flag = true;
//     outer: for (let row = 0; row < dimensions - 1; row++) {
//         for (let col = 0; col < dimensions - 1; col++) {
//             if (board[row][col] === "") {
//                 flag = false;
//                 break outer;
//             }
//         }
//     }
//     if (flag) return 0;
//     return null;
// }

// function endgame() {

// }

let player = "X";
let opponent = "O";
let gameover = false;
let dimensions = 5;
let counter = 0;
let wins = 0, losses = 0, ties = 0;
let board = [];

const grid = document.querySelector("#grid");
createGrid(dimensions);

let pixels = document.querySelectorAll('.pixel');
pixels.forEach(pixel => pixel.addEventListener('click', playerMove));