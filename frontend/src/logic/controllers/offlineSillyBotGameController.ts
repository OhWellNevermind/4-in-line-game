import { GameController } from '@/logic/GameController';
import { GameLogic } from '@/logic/GameLogic';

type InputContext = {
  rows: number;
  columns: number;
};
export const offlineSillyBotGameController = new GameController<
  GameLogic,
  InputContext
>((gameController, inputContext) => {
  const gameLogic = new GameLogic(inputContext.rows, inputContext.columns);

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
      setTimeout(() => {
        gameController.emit(
          'playMove',
          Math.floor(
            ((Math.random() > 0.5 ? 1 : -1) + moveResult.column + 7) % 7,
          ),
        );
      }, 400);
    }
  });

  return gameLogic;
});
