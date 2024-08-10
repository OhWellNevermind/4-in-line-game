import { GameLogic, GameLogicState, PlayerTurn } from './GameLogic';

type MoveResult = {
  validMove: boolean;
  hasWon: boolean;
  counters: {
    up: number;
    down: number;
    left: number;
    right: number;
    upRight: number;
    upLeft: number;
    downRight: number;
    downLeft: number;
  } | null;
  player: number;
  row: number;
  column: number;
};

export class GameMinimax {
  private board: number[][] = [];
  private rows: number = 0;
  private columns: number = 0;
  private columnTopSlotIndexes: number[] = [];
  private currentTurn: number = 1;
  private static nonePeg = 0;
  private static redPeg = 1;
  private static yellowPeg = 2;
  constructor(gameLogic: GameLogicState) {
    this.applyGameLogicState(gameLogic);
  }

  applyGameLogicState(gameLogic: GameLogicState) {
    this.board = gameLogic.board.map(row =>
      row.map(cell => GameMinimax.getNumberFromColor(cell)),
    );
    this.columnTopSlotIndexes = gameLogic.columnTopSlotIndexes.map(el => el);
    this.rows = gameLogic.rows;
    this.columns = gameLogic.columns;
    this.currentTurn = GameMinimax.getNumberFromColor(gameLogic.currentTurn);
  }

  static getNumberFromColor(turnOrCell: PlayerTurn | 'none') {
    return turnOrCell === 'none'
      ? GameMinimax.nonePeg
      : turnOrCell === 'red'
      ? GameMinimax.redPeg
      : GameMinimax.yellowPeg;
  }
  static getOpponentNumber(currentPlayer: number) {
    return currentPlayer === 1 ? 2 : 1;
  }
  getPossibleTurns() {
    const possibleTurns: number[] = [];
    this.columnTopSlotIndexes.forEach((topIndex, column) => {
      if (topIndex !== -1) {
        possibleTurns.push(column);
      }
    });
    return possibleTurns;
  }

  async getNextMove(isMaximizingPlayer = true, minimaxDepth = 6) {
    const currentTurn = this.currentTurn;
    const getPossibleMoves = this.getPossibleTurns.bind(this);
    const playMove = this.playMove.bind(this);
    const undoMove = this.undoMove.bind(this);

    function minimax(
      moveResult: MoveResult | null = null,
      depth = -1,
      alpha = -Infinity,
      beta = Infinity,
      isMaximizing: boolean,
    ) {
      function evaluate(result: MoveResult) {
        if (result.hasWon) {
          return 90 + depth;
        }
        const score = Object.values(result.counters || {}).reduce(
          (acc, fanCount) =>
            (acc +=
              fanCount === 0
                ? 0
                : fanCount === 1
                ? 1
                : fanCount === 2
                ? 4
                : 15),
          0,
        );
        return score;
      }

      if ((moveResult && moveResult.hasWon) || depth === 0) {
        const moveEvaluation = evaluate(moveResult!);
        return [
          moveResult!.player !== currentTurn ? -moveEvaluation : moveEvaluation,
          moveResult!.column,
        ];
      }
      const possibleMoves = getPossibleMoves();

      let bestMove = -1;
      let bestScore = isMaximizing ? -Infinity : Infinity;

      for (const move of possibleMoves) {
        const newMoveRes = playMove(move);
        if (isMaximizing) {
          const [moveScore] = minimax(
            newMoveRes,
            depth - 1,
            alpha,
            beta,
            false,
          );
          undoMove(move);
          alpha = Math.max(alpha, moveScore);
          if (moveScore > bestScore) {
            bestMove = move;
            bestScore = moveScore;
          }
          if (beta <= alpha) {
            break;
          }
        } else {
          const [moveScore] = minimax(newMoveRes, depth - 1, alpha, beta, true);
          undoMove(move);
          if (moveScore < bestScore) {
            bestMove = move;
            bestScore = moveScore;
          }
          beta = Math.min(beta, moveScore);
          if (beta <= alpha) {
            break;
          }
        }
      }
      return [bestScore, bestMove];
    }
    const startTime = Date.now();
    const [_, bestMove] = minimax(
      null,
      minimaxDepth,
      -Infinity,
      Infinity,
      isMaximizingPlayer,
    );
    console.log(`Found move in ${Date.now() - startTime}`);
    return bestMove;
  }

  playMove(column: number): MoveResult {
    const placePegRow = this.placePeg(column);
    const currentPlayer = this.currentTurn;

    if (placePegRow === -1) {
      return {
        validMove: false,
        hasWon: false,
        counters: null,
        player: currentPlayer,
        row: -1,
        column: -1,
      };
    }

    const { hasWon, counters } = this.checkWinFromSource(placePegRow, column);
    this.currentTurn =
      this.currentTurn === GameMinimax.yellowPeg
        ? GameMinimax.redPeg
        : GameMinimax.yellowPeg;

    return {
      validMove: true,
      hasWon,
      counters,
      player: currentPlayer,
      row: placePegRow,
      column,
    };
  }

  private placePeg(column: number) {
    if (this.columns <= column || column < 0) {
      return -1;
    }
    if (this.columnTopSlotIndexes[column] < 0) {
      return -1;
    }

    const row = this.columnTopSlotIndexes[column];

    if (this.board[row][column] !== 0) {
      return -1;
    }

    this.board[row][column] = this.currentTurn;
    this.columnTopSlotIndexes[column]--;

    return row;
  }

  undoMove(column: number) {
    if (this.columns <= column || column < 0) {
      return -1;
    }
    if (this.columnTopSlotIndexes[column] >= this.rows - 1) {
      return -1;
    }

    const row = this.columnTopSlotIndexes[column] + 1;

    if (this.board[row][column] === 0) {
      return -1;
    }

    this.board[row][column] = 0;
    this.columnTopSlotIndexes[column]++;
    this.currentTurn =
      this.currentTurn === GameMinimax.yellowPeg
        ? GameMinimax.redPeg
        : GameMinimax.yellowPeg;

    return row;
  }
  printBoard() {
    this.board.forEach(row => {
      console.log(
        row
          .map(el =>
            el === GameMinimax.redPeg
              ? '🟥'
              : el === GameMinimax.yellowPeg
              ? '🟨'
              : '⬛',
          )
          .join(''),
      );
    });
  }
  private boardToKey() {
    return this.board.map(row => row.join('')).join('');
  }

  private checkWinFromSource(row: number, column: number) {
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

    return {
      hasWon:
        Object.values(counters).some(el => el === 4) ||
        counters.up + counters.down > 4 ||
        counters.left + counters.right > 4 ||
        counters.upRight + counters.downLeft > 4 ||
        counters.upLeft + counters.downRight > 4,
      counters,
    };
  }
}
