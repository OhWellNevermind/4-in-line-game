import Peg from '@/components/board/Peg';
import { RootState } from '@/stores/store';
import { memoize } from 'proxy-memoize';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

type Props = {
  onPegClick: (row: number, column: number) => void;
};

const Field = ({ onPegClick }: Props) => {
  const { isInitialized, boardRows, boardColumns } = useSelector(
    memoize((state: RootState) => ({
      isInitialized: state.board.isInitialized,
      boardRows: state.board.rows,
      boardColumns: state.board.columns,
    })),
  );
  const [boardContainerHeight, setBoardContainerHeight] = useState(0);
  const [boardContainerWidth, setBoardContainerWidth] = useState(0);
  const squareSize = Math.min(boardContainerHeight, boardContainerWidth);

  const gap = 4;
  const smallerSize = Math.min(boardColumns, boardRows);

  let computedBoardWidth = (squareSize / smallerSize) * boardColumns || 1;
  let computedBoardHeight = (squareSize / smallerSize) * boardRows || 1;

  let scaleFactor = Math.min(
    boardContainerHeight / computedBoardHeight,
    boardContainerWidth / computedBoardWidth,
  );

  computedBoardWidth *= scaleFactor;
  computedBoardHeight *= scaleFactor;

  return (
    <>
      <View
        onLayout={event => {
          const { width, height } = event.nativeEvent.layout;
          setBoardContainerHeight(height);
          setBoardContainerWidth(width);
        }}
        style={styles.outerContainer}>
        {isInitialized && (
          <View
            style={{
              width: computedBoardWidth,
              height: computedBoardHeight,
              gap,
              ...styles.innerContainer,
            }}>
            {Array.from({ length: boardRows })?.map((row, rowI) => {
              return (
                <View key={rowI} style={{ gap, ...styles.pegsRow }}>
                  {Array.from({ length: boardColumns }).map(
                    (cellState, colI) => (
                      <Peg
                        key={colI}
                        column={colI}
                        row={rowI}
                        onClick={() => onPegClick(rowI, colI)}
                      />
                    ),
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pegsRow: {
    flexDirection: 'row',
    borderColor: 'red',
    flexGrow: 1,
  },
});
export default Field;
