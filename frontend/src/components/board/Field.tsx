import Peg from '@/components/board/Peg';
import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';
import Typography from '@/components/ui/Typography';
import { destroy, initialize } from '@/stores/boardSlice';
import { RootState } from '@/stores/store';
import { memoize } from 'proxy-memoize';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Field = () => {
  const { isInitialized, boardRows, boardColumns } = useSelector(
    memoize((state: RootState) => ({
      isInitialized: state.board.isInitialized,
      boardRows: state.board.rows,
      boardColumns: state.board.columns,
    })),
  );
  const dispatch = useDispatch();
  const [boardContainerHeight, setBoardContainerHeight] = useState(0);
  const [boardContainerWidth, setBoardContainerWidth] = useState(0);
  const squareSize = Math.min(boardContainerHeight, boardContainerWidth);

  const gap = 5;
  const smallerSize = Math.min(boardColumns, boardRows);

  let computedBoardWidth = (squareSize / smallerSize) * boardColumns || 1;
  let computedBoardHeight = (squareSize / smallerSize) * boardRows || 1;

  let scaleFactor = Math.min(
    boardContainerHeight / computedBoardHeight,
    boardContainerWidth / computedBoardWidth,
  );

  computedBoardWidth *= scaleFactor;
  computedBoardHeight *= scaleFactor;

  useEffect(() => {
    return () => {
      dispatch(destroy());
    };
  }, []);

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
                      <Peg key={colI} column={colI} row={rowI} />
                    ),
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
      <CustomTouchableOpacityButton
        onPress={() => {
          const rows = 7;
          const columns = 6;
          dispatch(initialize({ rows, columns, mode: 'headless' }));
        }}
        style={{
          marginVertical: 10,
        }}>
        <Typography>Rebuild</Typography>
      </CustomTouchableOpacityButton>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    // width: '100%',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  pegsRow: {
    flexDirection: 'row',
    borderColor: 'red',
    flexGrow: 1,
  },
});
export default Field;
