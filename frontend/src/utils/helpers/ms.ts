import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

// function for merging styles
export function ms(
  ...args: (StyleProp<ViewStyle | TextStyle | ImageStyle> | boolean)[]
) {
  const styles: ViewStyle | TextStyle | ImageStyle = {};

  args.forEach(el => {
    if (typeof el === 'boolean') {
      return;
    }
    Object.assign(styles, el);
  });

  return styles;
}
