/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const gameMenu = document.querySelector('section');

class Game {
  constructor(p1, p2, width = 7, height = 6) {
    this.players = [p1, p2];
    this.width = width;
    this.height = height;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.winner = '';
    this.gameOver = false;
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2); // not sure what this does...

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    setTimeout(() => {
      alert(msg);
    }, 200);
    if (this.gameOver === true) {
      setTimeout(() => {
        console.log('game over');
        const board = document.getElementById('board');
        board.innerHTML = '';
        gameMenu.style.display = 'flex';
      }, 1000);
    }
  }

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  handleClick = (evt) => {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);


    // assign winner string
    if (this.currPlayer === this.players[0]) {
      this.winner = 'Player 1';
    } else {
      this.winner = 'Player 2';
    }

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.winner} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver = true;
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.querySelector('#start-game').addEventListener('click', () => {
  gameMenu.style.display = "none";

  let p1 = new Player(document.querySelector('#player1').value);
  let p2 = new Player(document.querySelector('#player2').value);
  new Game(p1, p2);
});

