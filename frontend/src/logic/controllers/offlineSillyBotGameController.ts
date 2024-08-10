import { GameController } from '@/logic/GameController';
import { GameLogic } from '@/logic/GameLogic';
import { getNextMove } from '@/logic/GameMinimaxWorklet';
import { Worklets } from 'react-native-worklets-core';

type InputContext = {
  rows: number;
  columns: number;
};

// export const offlineSillyBotGameController = new GameController<
//   GameLogic,
//   InputContext
// >((gameController, inputContext) => {
//   const gameLogic = new GameLogic(inputContext.rows, inputContext.columns);
//   const gameMinimax = new GameMinimax(gameLogic.getState());

//   gameController.addListener('playMove', column => {
//     if (gameLogic.hasWon) {
//       return;
//     }
//     const moveResult = gameLogic.playMove(column);
//     gameController.emit('onMovePlayed', moveResult);
//   });

//   gameController.addListener('onMovePlayed', moveResult => {
//     gameLogic.printBoard();
//     if (moveResult.player === 'red') {
//       setTimeout(async () => {
//         gameMinimax.applyGameLogicState(gameLogic.getState());
//         const nextMove = await gameMinimax.getNextMove();
//         gameController.emit('playMove', nextMove);
//       }, 0);
//     }
//   });

//   return gameLogic;
// });

export const offlineSillyBotGameController = new GameController<
  GameLogic,
  InputContext
>((gameController, inputContext) => {
  const gameLogic = new GameLogic(inputContext.rows, inputContext.columns);
  // const gameMinimax = GameMinimax(gameLogic.getState());

  gameController.addListener('playMove', column => {
    if (gameLogic.hasWon) {
      return;
    }
    const moveResult = gameLogic.playMove(column);
    gameController.emit('onMovePlayed', moveResult);
  });

  gameController.addListener('onMovePlayed', moveResult => {
    gameLogic.printBoard();
    if (moveResult.player === 'red') {
      setTimeout(async () => {
        // gameMinimax.applyGameLogicState(gameLogic.getState());
        const context = Worklets.defaultContext;
        const gameLogicState = gameLogic.getState();
        const result = await context.runAsync(() => {
          'worklet';
          return getNextMove(gameLogicState);
        });
        const nextMove = result;
        gameController.emit('playMove', nextMove);
      }, 0);
    }
  });

  return gameLogic;
});
