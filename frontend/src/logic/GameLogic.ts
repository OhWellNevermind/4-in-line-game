export type PlayerTurn = 'red' | 'yellow';

export type MoveResult = {
  validMove: boolean;
  hasWon: boolean;
  player: PlayerTurn;
  row: number;
  column: number;
};

export type GameLogicState = {
  board: (PlayerTurn | 'none')[][];
  rows: number;
  columns: number;
  currentTurn: PlayerTurn;
  columnTopSlotIndexes: number[];
};

export class GameLogic {
  private _rows: number;
  private _columns: number;
  private _board: (PlayerTurn | 'none')[][];
  private _currentTurn: PlayerTurn;
  private _columnTopSlotIndexes: number[];
  private static firstTurn: PlayerTurn = 'red';
  public hasWon = false;

  constructor(rows: number, columns: number) {
    this._rows = rows;
    this._columns = columns;
    this._board = Array.from({ length: rows }).map(_ =>
      Array.from({ length: columns }).map(_ => 'none'),
    );
    this._currentTurn = GameLogic.firstTurn;
    this._columnTopSlotIndexes = Array.from({ length: columns }).map(
      _ => this._rows - 1,
    );
  }

  playMove(column: number) {
    const placePegRow = this.placePeg(column);
    const currentPlayer = this._currentTurn;

    if (placePegRow === -1) {
      return {
        validMove: false,
        hasWon: false,
        player: this._currentTurn,
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

    this._currentTurn = this._currentTurn === 'red' ? 'yellow' : 'red';

    return {
      validMove: true,
      hasWon: false,
      player: currentPlayer,
      row: placePegRow,
      column,
    };
  }

  private placePeg(column: number) {
    if (this._columns <= column || column < 0) {
      return -1;
    }
    if (this._columnTopSlotIndexes[column] < 0) {
      return -1;
    }

    const row = this._columnTopSlotIndexes[column];

    if (this._board[row][column] !== 'none') {
      return -1;
    }

    this._board[row][column] = this._currentTurn;
    this._columnTopSlotIndexes[column]--;

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

    const streak = {
      up: true,
      down: true,
      left: true,
      right: true,
      upRight: true,
      upLeft: true,
      downRight: true,
      downLeft: true,
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
      if (inRange(row - i, column, this.rows, this.columns)) {
        streak.up = b[row - i][column] === currentPeg && streak.up;
        counters.up += streak.up ? 1 : 0;
      }
      if (inRange(row + i, column, this.rows, this.columns)) {
        streak.down = b[row + i][column] === currentPeg && streak.down;
        counters.down += streak.down ? 1 : 0;
      }
      if (inRange(row, column - i, this.rows, this.columns)) {
        streak.left = b[row][column - i] === currentPeg && streak.left;
        counters.left += streak.left ? 1 : 0;
      }
      if (inRange(row, column + i, this.rows, this.columns)) {
        streak.right = b[row][column + i] === currentPeg && streak.right;
        counters.right += streak.right ? 1 : 0;
      }
      if (inRange(row - i, column - i, this.rows, this.columns)) {
        streak.upLeft = b[row - i][column - i] === currentPeg && streak.upLeft;
        counters.upLeft += streak.upLeft ? 1 : 0;
      }
      if (inRange(row - i, column + i, this.rows, this.columns)) {
        streak.upRight =
          b[row - i][column + i] === currentPeg && streak.upRight;
        counters.upRight += streak.upRight ? 1 : 0;
      }
      if (inRange(row + i, column - i, this.rows, this.columns)) {
        streak.downLeft =
          b[row + i][column - i] === currentPeg && streak.downLeft;
        counters.downLeft += streak.downLeft ? 1 : 0;
      }
      if (inRange(row + i, column + i, this.rows, this.columns)) {
        streak.downRight =
          b[row + i][column + i] === currentPeg && streak.downRight;
        counters.downRight += streak.downRight ? 1 : 0;
      }
    }

    return (
      Object.values(counters).some(el => el === 4) ||
      counters.up + counters.down > 4 ||
      counters.left + counters.right > 4 ||
      counters.upRight + counters.downLeft > 4 ||
      counters.upLeft + counters.downRight > 4
    );
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

  getState(): GameLogicState {
    return {
      board: this._board.map(el => el.map(peg => peg)),
      rows: this._rows,
      columns: this._columns,
      currentTurn: this._currentTurn,
      columnTopSlotIndexes: this._columnTopSlotIndexes,
    };
  }
  get rows() {
    return this._rows;
  }
  get columns() {
    return this._columns;
  }
  get columnTopSlotIndexes() {
    return this._columnTopSlotIndexes;
  }
  get currentTurn() {
    return this._currentTurn;
  }
  get board() {
    return this._board;
  }
}
