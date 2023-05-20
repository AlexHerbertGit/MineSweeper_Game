const readline = require('readline');
//Declaring global variables.
const boardSize = 3;
const numMines = 2;
let board = [];
let revealed = [];
let mines = [];
let marked = [];
//Declaring Loss conditions.
let lossCondition = false;
let winCondition = false;
//Game board initialize function.
function gameBoard() {
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    revealed[i] = [];
    marked[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = 0;
      revealed[i][j] = false;
      marked[i][j] = false;
    }
  }
}
//Place Mines function.
function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (board[row][col] !== "X") {
      board[row][col] = "X";
      mines.push([row, col]);
      minesPlaced++;
    }
  }
}
//Adjacent Mines function.
function adjacentMines() {
  for (let i = 0; i < mines.length; i++) {
    const [x, y] = mines[i];
    for (let offX = -1; offX <= 1; offX++) {
      for (let offY = -1; offY <= 1; offY++) {
        const newX = x + offX;
        const newY = y + offY;
        if (
          newX >= 0 &&
          newX < boardSize &&
          newY >= 0 &&
          newY < boardSize &&
          board[newX][newY] !== "X"
        ) {
          board[newX][newY]++;
        }
      }
    }
  }
}
//Update Board Function.
function updateBoard() {
  for (let i = 0; i < boardSize; i++) {
    let row = '';
    for (let j = 0; j < boardSize; j++) {
      if (revealed[i][j]) {
        row += board[i][j] + ' ';
      } else if (marked[i][j]) {
        row += "! ";
      } else {
        row += '- ';
      }
    }
    console.log(row);
  }
}
//Marking a cell function.
function markCell(x, y) {
  if (revealed[x][y]) {
    console.log("Cell is already revealed, choose another cell.");
  } else {
    marked[x][y] = !marked[x][y];
  }
}
//Reveal cells function.
function revealCell(x, y) {
  if (revealed[x][y]) {
    console.log("Cell is already revealed. Choose again.");
    return;
  }

  if (board[x][y] === "X") {
    lossCondition = true;
    console.log("You Hit a Mine! Game Over Nerd");
  }

  revealed[x][y] = true;

  if (board[x][y] === 0) {
    for (let offX = -1; offX <= 1; offX++) {
      for (let offY = -1; offY <= 1; offY++) {
        const newX = x + offX;
        const newY = y + offY;
        if (
          newX >= 0 &&
          newX < boardSize &&
          newY >= 0 &&
          newY < boardSize &&
          !revealed[newX][newY]
        ) {
          revealCell(newX, newY);
        }
      }
    }
  }
}
//Reveal all cells function, envoked by the win or loss conditions.
function revealAllCells() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      revealed[i][j] = true;
    }
  }
  updateBoard();
}
//Game Initiation Function.
function initGame() {
  gameBoard();
  placeMines();
  adjacentMines();
  console.log("Welcome to Minesweeper! The - represent the grid cells. Select a cell by entering 'reveal' and the coordinates and to mark a cell enter 'mark' and the coordinates e.g 'reveal 1 2'");
}
//Start Game Function
function startGame() {
  initGame();
  updateBoard();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
//Readline player input initialzing, win and loss conditions and player input validation conditions.
  rl.on('line', (input) => {
    if (!lossCondition && !winCondition) {
      const [command, x, y] = input.trim().split(' ');
      if (command === 'reveal') {
        if (x !== undefined && y !== undefined && !isNaN(x) && !isNaN(y)) {
          const xPos = parseInt(x);
          const yPos = parseInt(y);
          if (
            xPos >= 0 &&
            xPos < boardSize &&
            yPos >= 0 &&
            yPos < boardSize
          ) {
            revealCell(xPos, yPos);
            updateBoard();

            let allCellsRevealed = true;
            for (let i = 0; i < boardSize; i++) {
              for (let j = 0; j < boardSize; j++) {
                if (!revealed[i][j] && board[i][j] !== 'X') {
                  allCellsRevealed = false;
                  break;
                }
              }
              if (!allCellsRevealed) {
                break;
              }
            }

            if (allCellsRevealed) {
              winCondition = true;
              console.log('You Win! Well Done Nerd');
              revealAllCells();
              rl.close();
            }
          } else {
            console.log('Invalid Input! Please choose coordinates within the board.');
          }
        } else {
          console.log('Invalid Input! Please enter valid coordinates.');
        }
      } else if (command === 'mark') {
        if (x !== undefined && y !== undefined && !isNaN(x) && !isNaN(y)) {
          const xPos = parseInt(x);
          const yPos = parseInt(y);
          if (
            xPos >= 0 &&
            xPos < boardSize &&
            yPos >= 0 &&
            yPos < boardSize
          ) {
            markCell(xPos, yPos);
            updateBoard();
          } else {
            console.log('Invalid Input! Please choose coordinates within the board.');
          }
        } else {
          console.log('Invalid Input! Please enter valid coordinates.');
        }
      } else {
        console.log('Invalid command! Please enter a valid command.');
      }
    } else {
      rl.close();
    }
  });

  console.log("Select a cell by entering coordinates here:");
}
//Starts the game once file is ran with node.js
startGame();
