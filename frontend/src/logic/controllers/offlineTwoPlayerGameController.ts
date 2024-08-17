import { GameController } from '@/logic/GameController';
import { GameLogic } from '@/logic/GameLogic';

type InputContext = {
  rows: number;
  columns: number;
};
export const offlineTwoPlayerGameController = new GameController<
  GameLogic,
  InputContext
>((gameController, inputContext) => {
  const gameLogic = new GameLogic(inputContext.rows, inputContext.columns);

  gameController.addListener('playMove', column => {
    if (gameLogic.hasWon) {
      return;
    }
    const moveResult = gameLogic.playMove(column);
    console.log('played move', moveResult);
    gameController.emit('onMovePlayed', moveResult);
  });

  return gameLogic;
});
