import { GameController } from '@/logic/GameController';
import { GameLogic } from '@/logic/GameLogic';
import { GameMinimax } from '@/logic/GameMinimax';

type InputContext = {
  rows: number;
  columns: number;
};

export const offlineSillyBotGameController = new GameController<
  GameLogic,
  InputContext
>((gameController, inputContext) => {
  const gameLogic = new GameLogic(inputContext.rows, inputContext.columns);
  const gameMinimax = new GameMinimax(gameLogic);

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
        gameMinimax.applyGameLogicState(gameLogic);
        const nextMove = await gameMinimax.getNextMove();
        gameController.emit('playMove', nextMove);
      }, 0);
    }
  });

  return gameLogic;
});
