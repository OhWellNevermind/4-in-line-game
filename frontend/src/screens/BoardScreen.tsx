import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Field from '@/components/board/Field';
import { BoardScreenNavigationProp, BoardScreenRouteProp } from '@/types/types';
import Layout from '@/screens/Layout';
import useOrientation from '@/utils/hooks/useOrientation';
import NavigationBar from '@/components/ui/NavigationBar';
import {
  destroy,
  initialize,
  setBoardState,
  setRowAndCell,
} from '@/stores/boardSlice';
import Typography from '@/components/ui/Typography';
import { RootState } from '@/stores/store';
import { memoize } from 'proxy-memoize';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { GameController, GameControllerEvents } from '@/logic/GameController';
import { offlineSillyBotGameController } from '@/logic/controllers/offlineSillyBotGameController';
import { offlineTwoPlayerGameController } from '@/logic/controllers/offlineTwoPlayerGameController';

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

  const { hasWon, error, playerTurn } = useSelector(
    memoize((state: RootState) => ({
      hasWon: state.board.hasWon,
      error: state.board.error,
      playerTurn: state.board.playerTurn,
    })),
  );

  const opponentName = mode;
  const orientation = useOrientation();
  const dispatch = useDispatch();

  useEffect(() => {
    const rows = 6;
    const columns = 7;
    dispatch(initialize({ rows, columns }));

    const eventHandlers: GameControllerEvents = {
      playMove: () => {},
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
        }
      },
    };

    switch (mode) {
      case 'twoPlayers':
        setGameController(
          offlineTwoPlayerGameController.initialize(eventHandlers, {
            rows,
            columns,
          }),
        );
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
        setGameController(
          offlineSillyBotGameController.initialize(eventHandlers, {
            rows,
            columns,
          }),
        );
        break;
      default:
        dispatch(setBoardState({ error: 'Unavailable mode' }));
        return;
    }

    return () => {
      dispatch(destroy());
      offlineSillyBotGameController.clean();
      setGameController(null);
    };
  }, [dispatch, mode]);

  function handlePegClick(row: number, column: number) {
    if (!gameController || hasWon) {
      return;
    }
    if (playerTurn !== 'red' && mode !== 'twoPlayers') {
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
        <View
          style={
            orientation === 'landscape'
              ? styles.menuLandscape
              : styles.menuPortrait
          }>
          <Typography>You're playing against: {opponentName}</Typography>
          <Typography>Turn: {playerTurn}</Typography>
          <ErrorMessage>{error}</ErrorMessage>
          {hasWon && <Typography>{playerTurn} player has won</Typography>}
        </View>
        <Field onPegClick={handlePegClick} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  wrapperPortrait: { flexGrow: 1 },
  wrapperLandscape: { flexGrow: 1, flexDirection: 'row', gap: 20 },

  menuPortrait: { flexGrow: 1, maxHeight: 250, gap: 20 },
  menuLandscape: { flexGrow: 1, maxWidth: 250, gap: 20 },
});

export default BoardPage;
