import ErrorMessage from '@/components/ui/ErrorMessage';
import Typography from '@/components/ui/Typography';
import { theme } from '@/utils/consts/theme';
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
    <View style={[styles.defaultContainerStyles, style?.container]}>
      <Typography style={[styles.defaultLabelStyles, style?.label]}>
        {label}
      </Typography>
      <TextInput
        placeholderTextColor={theme.color.text_gray_medium}
        style={[
          styles.defaultInputStyles,
          error ? styles.errorInputStyles : {},
          style?.input,
        ]}
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
    marginBottom: 17,
  },
  errorInputStyles: {
    marginBottom: 2,
  },
  defaultLabelStyles: {
    color: '#fff',
  },
  defaultContainerStyles: {
    gap: 0,
  },
});
export default CustomTextInput;
