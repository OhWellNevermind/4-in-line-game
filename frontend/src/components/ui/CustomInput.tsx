import ErrorMessage from '@/components/ui/ErrorMessage';
import Typography from '@/components/ui/Typography';
import { theme } from '@/utils/consts/theme';
import { ms } from '@/utils/helpers/ms';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  label: string;
  error?: string;
  style?: {
    container?: StyleProp<ViewStyle>;
    input?: StyleProp<ViewStyle>;
    label?: StyleProp<ViewStyle>;
  };
} & TextInputProps;
const CustomTextInput = ({ error, label, style, ...props }: Props) => {
  return (
    <View style={ms(styles.defaultContainerStyles, style?.container)}>
      <Typography style={ms(styles.defaultLabelStyles, style?.label)}>
        {label}
      </Typography>
      <TextInput
        placeholderTextColor={theme.color.text_gray_medium}
        style={ms(
          styles.defaultInputStyles,
          { marginBottom: error ? 2 : 17 },
          style?.input,
        )}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultInputStyles: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#111',
    borderColor: '#111',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'HermeneusOne-Regular',
    margin: 0,
    marginTop: 8,
  },
  defaultLabelStyles: {
    color: '#fff',
  },
  defaultContainerStyles: {
    gap: 0,
  },
});
export default CustomTextInput;
