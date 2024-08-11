import { GameLogicState, PlayerColor } from './GameLogic';

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

function GameMinimax(
  gameLogicState: GameLogicState,
  options: { depth: number },
) {
  'worklet';
  let board: number[][] = [];
  let rows: number = 0;
  let columns: number = 0;
  let columnTopSlotIndexes: number[] = [];
  let currentTurn: number = 1;
  const nonePeg = 0;
  const redPeg = 1;
  const yellowPeg = 2;

  function applyGameLogicState(gameLogic: GameLogicState) {
    'worklet';
    board = gameLogic.board.map(row =>
      row.map(cell => getNumberFromColor(cell)),
    );
    columnTopSlotIndexes = gameLogic.columnTopSlotIndexes.map(el => el);
    rows = gameLogic.rows;
    columns = gameLogic.columns;
    currentTurn = getNumberFromColor(gameLogic.currentTurn);
  }

  function getNumberFromColor(turnOrCell: PlayerColor | 'none') {
    'worklet';
    return turnOrCell === 'none'
      ? nonePeg
      : turnOrCell === 'red'
      ? redPeg
      : yellowPeg;
  }

  function getPossibleMoves() {
    'worklet';
    const possibleTurns: number[] = [];
    columnTopSlotIndexes.forEach((topIndex, column) => {
      if (topIndex !== -1) {
        possibleTurns.push(column);
      }
    });
    return possibleTurns;
  }

  function getNextMove(isMaximizingPlayer = true, minimaxDepth = 6) {
    'worklet';
    const actualCurrentTurn = currentTurn;

    function minimax(
      moveResult: MoveResult | null = null,
      depth = -1,
      alpha = -Infinity,
      beta = Infinity,
      isMaximizing: boolean,
    ) {
      'worklet';
      function evaluate(result: MoveResult) {
        'worklet';
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
          moveResult!.player !== actualCurrentTurn
            ? -moveEvaluation
            : moveEvaluation,
          moveResult!.column,
        ];
      }
      const possibleMoves = getPossibleMoves();

      let bestMove = -1;
      let bestScore = isMaximizing ? -Infinity : Infinity;

      for (const move of possibleMoves) {
        const newMoveRes = playMove(move);
        if (isMaximizing) {
          const moveScore = minimax(
            newMoveRes,
            depth - 1,
            alpha,
            beta,
            false,
          )[0];
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
          const moveScore = minimax(
            newMoveRes,
            depth - 1,
            alpha,
            beta,
            true,
          )[0];
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
    const bestMove = minimax(
      null,
      minimaxDepth,
      -Infinity,
      Infinity,
      isMaximizingPlayer,
    )[1];
    console.log(`Found move in ${Date.now() - startTime}`);
    return bestMove;
  }

  function playMove(column: number): MoveResult {
    'worklet';
    const placePegRow = placePeg(column);
    const currentPlayer = currentTurn;

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

    const { hasWon, counters } = checkWinFromSource(placePegRow, column);
    currentTurn = currentTurn === yellowPeg ? redPeg : yellowPeg;

    return {
      validMove: true,
      hasWon,
      counters,
      player: currentPlayer,
      row: placePegRow,
      column,
    };
  }

  function placePeg(column: number) {
    'worklet';
    if (columns <= column || column < 0) {
      return -1;
    }
    if (columnTopSlotIndexes[column] < 0) {
      return -1;
    }

    const row = columnTopSlotIndexes[column];

    if (board[row][column] !== 0) {
      return -1;
    }

    board[row][column] = currentTurn;
    columnTopSlotIndexes[column]--;

    return row;
  }

  function undoMove(column: number) {
    'worklet';
    if (columns <= column || column < 0) {
      return -1;
    }
    if (columnTopSlotIndexes[column] >= rows - 1) {
      return -1;
    }

    const row = columnTopSlotIndexes[column] + 1;

    if (board[row][column] === 0) {
      return -1;
    }

    board[row][column] = 0;
    columnTopSlotIndexes[column]++;
    currentTurn = currentTurn === yellowPeg ? redPeg : yellowPeg;

    return row;
  }

  function checkWinFromSource(row: number, column: number) {
    'worklet';
    const currentPeg = board[row][column];

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
      'worklet';
      return !(row < 0 || row >= rows || column < 0 || column >= columns);
    }

    const b = board;

    for (let i = 0; i < 4; i++) {
      if (inRange(row - i, column, rows, columns)) {
        streak.up = b[row - i][column] === currentPeg && streak.up;
        counters.up += streak.up ? 1 : 0;
      }
      if (inRange(row + i, column, rows, columns)) {
        streak.down = b[row + i][column] === currentPeg && streak.down;
        counters.down += streak.down ? 1 : 0;
      }
      if (inRange(row, column - i, rows, columns)) {
        streak.left = b[row][column - i] === currentPeg && streak.left;
        counters.left += streak.left ? 1 : 0;
      }
      if (inRange(row, column + i, rows, columns)) {
        streak.right = b[row][column + i] === currentPeg && streak.right;
        counters.right += streak.right ? 1 : 0;
      }
      if (inRange(row - i, column - i, rows, columns)) {
        streak.upLeft = b[row - i][column - i] === currentPeg && streak.upLeft;
        counters.upLeft += streak.upLeft ? 1 : 0;
      }
      if (inRange(row - i, column + i, rows, columns)) {
        streak.upRight =
          b[row - i][column + i] === currentPeg && streak.upRight;
        counters.upRight += streak.upRight ? 1 : 0;
      }
      if (inRange(row + i, column - i, rows, columns)) {
        streak.downLeft =
          b[row + i][column - i] === currentPeg && streak.downLeft;
        counters.downLeft += streak.downLeft ? 1 : 0;
      }
      if (inRange(row + i, column + i, rows, columns)) {
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
  applyGameLogicState(gameLogicState);
  return getNextMove(true, options.depth);
}

export function getNextMove(gameLogicState: GameLogicState, depth = 6): number {
  'worklet';
  const nextMove = GameMinimax(gameLogicState, { depth });
  return nextMove;
}
