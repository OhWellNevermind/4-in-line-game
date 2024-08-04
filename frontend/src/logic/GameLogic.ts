export type PlayerTurn = 'red' | 'yellow';

export type MoveResult = {
  validMove: boolean;
  hasWon: boolean;
  player: PlayerTurn;
  row: number;
  column: number;
};

export class GameLogic {
  private rows: number;
  private columns: number;
  private _board: (PlayerTurn | 'none')[][];
  private currentTurn: PlayerTurn;
  private columnTopSlotIndexes: number[];
  private static firstTurn: PlayerTurn = 'red';
  public hasWon = false;

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this._board = Array.from({ length: rows }).map(_ =>
      Array.from({ length: columns }).map(_ => 'none'),
    );
    this.currentTurn = GameLogic.firstTurn;
    this.columnTopSlotIndexes = Array.from({ length: columns }).map(
      _ => this.rows - 1,
    );
  }

  playMove(column: number) {
    const placePegRow = this.placePeg(column);
    const currentPlayer = this.currentTurn;

    if (placePegRow === -1) {
      return {
        validMove: false,
        hasWon: false,
        player: this.currentTurn,
        row: -1,
        column: -1,
      };
    }

    const isWin = this.checkWinFromSource(placePegRow, column);

    if (isWin) {
      this.hasWon = true;
      return {
        validMove: true,
        hasWon: true,
        player: currentPlayer,
        row: placePegRow,
        column,
      };
    }

    this.currentTurn = this.currentTurn === 'red' ? 'yellow' : 'red';

    return {
      validMove: true,
      hasWon: false,
      player: currentPlayer,
      row: placePegRow,
      column,
    };
  }

  placePeg(column: number) {
    if (this.columns <= column || column < 0) {
      return -1;
    }
    if (this.columnTopSlotIndexes[column] < 0) {
      return -1;
    }

    const row = this.columnTopSlotIndexes[column];

    if (this._board[row][column] !== 'none') {
      return -1;
    }

    this._board[row][column] = this.currentTurn;
    this.columnTopSlotIndexes[column]--;

    return row;
  }

  checkWinFromSource(row: number, column: number) {
    const currentPeg = this.board[row][column];

    const counters = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      upRight: 0,
      upLeft: 0,
      downRight: 0,
      downLeft: 0,
    };

    function inRange(
      row: number,
      column: number,
      rows: number,
      columns: number,
    ) {
      return !(row < 0 || row >= rows || column < 0 || column >= columns);
    }

    const b = this.board;

    for (let i = 0; i < 4; i++) {
      if (
        inRange(row - i, column, this.rows, this.columns) &&
        b[row - i][column] === currentPeg
      ) {
        counters.up++;
      }
      if (
        inRange(row + i, column, this.rows, this.columns) &&
        b[row + i][column] === currentPeg
      ) {
        counters.down++;
      }
      if (
        inRange(row, column - i, this.rows, this.columns) &&
        b[row][column - i] === currentPeg
      ) {
        counters.left++;
      }
      if (
        inRange(row, column + i, this.rows, this.columns) &&
        b[row][column + i] === currentPeg
      ) {
        counters.right++;
      }
      if (
        inRange(row - i, column - i, this.rows, this.columns) &&
        b[row - i][column - i] === currentPeg
      ) {
        counters.upLeft++;
      }
      if (
        inRange(row - i, column + i, this.rows, this.columns) &&
        b[row - i][column + i] === currentPeg
      ) {
        counters.upRight++;
      }
      if (
        inRange(row + i, column - i, this.rows, this.columns) &&
        b[row + i][column - i] === currentPeg
      ) {
        counters.downLeft++;
      }
      if (
        inRange(row + i, column + i, this.rows, this.columns) &&
        b[row + i][column + i] === currentPeg
      ) {
        counters.downRight++;
      }
    }
    return Object.values(counters).some(el => el === 4);
  }

  printBoard() {
    this._board.forEach(row => {
      console.log(
        row
          .map(el => (el === 'red' ? '🟥' : el === 'yellow' ? '🟨' : '⬛'))
          .join(''),
      );
    });
  }

  get board() {
    return this._board;
  }
}
