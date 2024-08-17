import { setRowAndCell } from '@/stores/boardSlice';
import { RootState } from '@/stores/store';
import { CellState } from '@/types/boardTypes';
import { theme } from '@/utils/consts/theme';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  column: number;
  row: number;
  onClick: () => void;
};

const pegColors: { [key in CellState]: string } = {
  none: '#aaa',
  red: theme.color.red_peg,
  yellow: theme.color.yellow_peg,
};

const Peg = ({ column, row, onClick }: Props) => {
  const cellState = useSelector(
    (state: RootState) => state.board.board?.[row]?.[column],
  );

  return (
    <TouchableWithoutFeedback onPress={() => onClick()}>
      <View
        style={{
          backgroundColor: pegColors[cellState || 'none'],
          ...styles.peg,
        }}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  peg: {
    flexGrow: 1,
    borderRadius: 1000,
  },
});
export default Peg;
