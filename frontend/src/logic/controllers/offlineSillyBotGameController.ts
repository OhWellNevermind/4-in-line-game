import { GameController } from '@/logic/GameController';
import { GameLogic, PlayerColor as PlayerColor } from '@/logic/GameLogic';
import { getNextMove } from '@/logic/GameMinimaxWorklet';
import { Worklets } from 'react-native-worklets-core';

type InputContext = {
  rows: number;
  columns: number;
  currentPlayerColor: PlayerColor;
};

export const offlineSillyBotGameController = new GameController<
  GameLogic,
  InputContext
>((gameController, inputContext) => {
  const gameLogic = new GameLogic(inputContext.rows, inputContext.columns);

  gameController.addListener('onGameStarted', ({ startingPlayerColor }) => {
    if (startingPlayerColor !== inputContext.currentPlayerColor) {
      setTimeout(() => {
        gameController.emit(
          'playMove',
          Math.floor(Math.random() * inputContext.columns),
        );
      }, 1000);
    }
  });
  gameController.addListener('playMove', column => {
    if (gameLogic.hasWon) {
      return;
    }
    const moveResult = gameLogic.playMove(column);
    gameController.emit('onMovePlayed', moveResult);
  });

  gameController.addListener('onMovePlayed', async moveResult => {
    gameLogic.printBoard();
    if (moveResult.player === inputContext.currentPlayerColor) {
      gameController.emit('onCurrentPlayerMovePlayed');
      const context = Worklets.defaultContext;
      const gameLogicState = gameLogic.getState();
      const nextMove = await context.runAsync(() => {
        'worklet';
        return getNextMove(gameLogicState);
      });
      gameController.emit('playMove', nextMove);
    } else {
      gameController.emit('onOpponentPlayerMovePlayed');
    }
  });

  return gameLogic;
});
