import { setRowAndCell } from '@/stores/boardSlice';
import { RootState } from '@/stores/store';
import { TCellState } from '@/types/boardTypes';
import { memoize } from 'proxy-memoize';
import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  column: number;
  row: number;
};

const pegColors: { [key in TCellState]: string } = {
  none: '#aaa',
  red: 'red',
  yellow: 'yellow',
};
const Peg = ({ column, row }: Props) => {
  const cellState = useSelector(
    (state: RootState) => state.board.board?.[row]?.[column],
  );
  const dispatch = useDispatch();

  console.log('render', column, row);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        dispatch(
          setRowAndCell({
            column,
            row,
            type:
              cellState === 'none'
                ? 'red'
                : cellState === 'red'
                ? 'yellow'
                : 'none',
          }),
        );
      }}>
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
