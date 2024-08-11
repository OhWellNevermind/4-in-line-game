import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
} & TouchableOpacityProps;

const CustomTouchableOpacityButton = ({
  style,
  onPress,
  children,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.defaultStyles, style]}
      onPress={onPress}
      {...props}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultStyles: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#333',
    backgroundColor: '#dedede',
    alignItems: 'center',
    //iOS
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 0 },
    shadowRadius: 4,
    //Android
    elevation: 7,
  },
});
export default CustomTouchableOpacityButton;
