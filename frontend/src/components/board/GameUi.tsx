import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Typography from '@/components/ui/Typography';
import { RootState } from '@/stores/store';
import { GameModes } from '@/types/types';
import { capitalize } from '@/utils/helpers/capitalize';
import useOrientation from '@/utils/hooks/useOrientation';
import { memoize } from 'proxy-memoize';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

type Props = {
  mode: GameModes;
  onReplay: () => void;
};

const GameUi = ({ mode, onReplay }: Props) => {
  const { isTie, hasWon, error, playerTurn, currentPlayerColor } = useSelector(
    memoize((state: RootState) => ({
      isTie: state.board.isTie,
      hasWon: state.board.hasWon,
      error: state.board.error,
      playerTurn: state.board.playerTurn,
      currentPlayerColor: state.board.currentPlayerColor,
    })),
  );

  const isPlayersMove = playerTurn === currentPlayerColor;
  const isWaitingForOpponentMove =
    mode !== 'twoPlayers' && !isPlayersMove && !hasWon && !isTie;
  const opponentName = 'Arthur1488';
  const orientation = useOrientation();
  return (
    <View
      style={
        orientation === 'landscape' ? styles.menuLandscape : styles.menuPortrait
      }>
      <View style={styles.menuTextView}>
        <View>
          {(mode === 'online' || mode === 'onlineRoom') && (
            <Typography>You're playing against: {opponentName}</Typography>
          )}
          {mode === 'twoPlayers' && (
            <Typography>You're playing on the same device</Typography>
          )}
          {mode === 'offlineBot' && (
            <Typography>You're playing against a bot</Typography>
          )}
        </View>
        <View>
          {(mode === 'online' || mode === 'onlineRoom') &&
            (isPlayersMove ? (
              <Typography>Your turn</Typography>
            ) : (
              <Typography>{opponentName}'s turn</Typography>
            ))}
          {mode === 'twoPlayers' && (
            <Typography>{capitalize(playerTurn)}'s turn</Typography>
          )}
          {mode === 'offlineBot' &&
            (isPlayersMove ? (
              <Typography>Your turn</Typography>
            ) : (
              <Typography>Bot's turn</Typography>
            ))}
        </View>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {hasWon && (
          <View>
            {(mode === 'online' || mode === 'onlineRoom') && (
              <Typography>{opponentName} has won</Typography>
            )}
            {mode === 'twoPlayers' && (
              <Typography>{capitalize(playerTurn)} player has won</Typography>
            )}
            {mode === 'offlineBot' &&
              (playerTurn === currentPlayerColor ? (
                <Typography>You have won</Typography>
              ) : (
                <Typography>Bot has won</Typography>
              ))}
          </View>
        )}
        {isTie && (
          <View>
            <Typography>Game ended in a tie</Typography>
          </View>
        )}
        {isWaitingForOpponentMove && (
          <View>
            {(mode === 'online' || mode === 'onlineRoom') && (
              <Typography>Waiting for opponent to make a move...</Typography>
            )}
            {mode === 'offlineBot' && (
              <Typography>Bot is thinking...</Typography>
            )}
          </View>
        )}
      </View>
      {(hasWon || isTie) && (
        <CustomTouchableOpacityButton onPress={onReplay}>
          <Typography>Replay</Typography>
        </CustomTouchableOpacityButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuTextView: {
    gap: 16,
  },
  menuPortrait: {
    flexGrow: 1,
    maxHeight: 250,
    justifyContent: 'space-between',
  },
  menuLandscape: {
    flexGrow: 1,
    maxWidth: 250,
    justifyContent: 'space-between',
  },
});
export default GameUi;
