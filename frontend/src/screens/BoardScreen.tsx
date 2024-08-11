import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Field from '@/components/board/Field';
import { BoardScreenNavigationProp, BoardScreenRouteProp } from '@/types/types';
import Layout from '@/screens/Layout';
import useOrientation from '@/utils/hooks/useOrientation';
import NavigationBar from '@/components/ui/NavigationBar';
import {
  changeCurrentTurn,
  destroy,
  initialize,
  setBoardState,
  setRowAndCell,
} from '@/stores/boardSlice';
import { RootState } from '@/stores/store';
import { memoize } from 'proxy-memoize';
import { GameController, GameControllerEvents } from '@/logic/GameController';
import { offlineSillyBotGameController } from '@/logic/controllers/offlineSillyBotGameController';
import { offlineTwoPlayerGameController } from '@/logic/controllers/offlineTwoPlayerGameController';
import GameUi from '@/components/board/GameUi';

type Props = {
  navigation: BoardScreenNavigationProp;
  route: BoardScreenRouteProp;
};

const BoardPage = ({ navigation, route }: Props) => {
  const { mode } = route.params;

  const [gameController, setGameController] = useState<GameController<
    any,
    any
  > | null>(null);

  const { isTie, hasWon, playerTurn, currentPlayerColor } = useSelector(
    memoize((state: RootState) => ({
      isTie: state.board.isTie,
      hasWon: state.board.hasWon,
      playerTurn: state.board.playerTurn,
      currentPlayerColor: state.board.currentPlayerColor,
    })),
  );

  const orientation = useOrientation();
  const dispatch = useDispatch();
  const [replayState, setReplayState] = useState(0);

  useEffect(() => {
    const rows = 6;
    const columns = 7;
    const newGameCurrentPlayerColor = Math.random() > 0.5 ? 'red' : 'yellow';
    dispatch(
      initialize({
        rows,
        columns,
        playerTurn: 'red',
        currentPlayerColor: newGameCurrentPlayerColor,
      }),
    );

    const eventHandlers: Partial<GameControllerEvents> = {
      onMovePlayed: moveResult => {
        if (!moveResult.validMove) {
          return dispatch(
            setBoardState({
              error: 'Invalid move',
            }),
          );
        }

        dispatch(
          setRowAndCell({
            row: moveResult.row,
            column: moveResult.column,
            type: moveResult.player,
          }),
        );

        if (moveResult.hasWon) {
          dispatch(
            setBoardState({
              hasWon: true,
            }),
          );
        } else if (moveResult.isTie) {
          dispatch(
            setBoardState({
              isTie: true,
            }),
          );
        } else {
          dispatch(changeCurrentTurn());
        }
      },
    };

    let controller: GameController<any, any>;

    switch (mode) {
      case 'twoPlayers':
        controller = offlineTwoPlayerGameController.initialize(eventHandlers, {
          rows,
          columns,
        });
        break;
      // case 'online':
      //   setGameController(
      //     offlineSillyBotGameController.initialize(eventHandlers, {
      //       rows,
      //       columns,
      //     }),
      //   );
      //   break;
      // case 'onlineRoom':
      //   setGameController(
      //     offlineSillyBotGameController.initialize(eventHandlers, {
      //       rows,
      //       columns,
      //     }),
      //   );
      //   break;
      case 'offlineBot':
        controller = offlineSillyBotGameController.initialize(eventHandlers, {
          rows,
          columns,
          currentPlayerColor: newGameCurrentPlayerColor,
        });
        break;
      default:
        dispatch(setBoardState({ error: 'Unavailable mode' }));
        return;
    }

    setGameController(controller);
    controller.emit('onGameStarted', { startingPlayerColor: 'red' });
    return () => {
      dispatch(destroy());
      controller.clean();
      setGameController(null);
    };
  }, [dispatch, mode, replayState]);

  function handlePegClick(row: number, column: number) {
    if (!gameController || hasWon || isTie) {
      return;
    }
    if (playerTurn !== currentPlayerColor && mode !== 'twoPlayers') {
      return;
    }
    gameController.playMove(column);
  }

  return (
    <Layout
      navigationComponent={
        orientation === 'portrait' ? (
          <NavigationBar
            title="Game"
            onBack={() => {
              navigation.navigate('GameModes');
            }}
          />
        ) : null
      }>
      <View
        style={
          orientation === 'landscape'
            ? styles.wrapperLandscape
            : styles.wrapperPortrait
        }>
        <GameUi
          mode={mode}
          onReplay={() => setReplayState(state => state + 1)}
        />
        <Field onPegClick={handlePegClick} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  wrapperPortrait: { flexGrow: 1 },
  wrapperLandscape: { flexGrow: 1, flexDirection: 'row', gap: 20 },
});

export default BoardPage;
