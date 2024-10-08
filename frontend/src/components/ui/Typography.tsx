import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { theme } from '@/utils/consts/theme';

type Props = {
  size?: keyof typeof theme.text;
  color?: keyof typeof theme.color;
  children: React.ReactNode;
} & TextProps;

const Typography = ({ size, color, style, children, ...props }: Props) => {
  const defaultSize = 'md';
  const defaultColor = 'text_black';
  return (
    <Text
      style={[
        styles.defaultStyle,
        {
          fontSize: theme.text[size || defaultSize],
        },
        {
          color: theme.color[color || defaultColor],
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: 'HermeneusOne-Regular',
  },
});

export default Typography;
