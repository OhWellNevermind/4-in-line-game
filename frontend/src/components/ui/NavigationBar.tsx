import Typography from '@/components/ui/Typography';
import { theme } from '@/utils/consts/theme';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  onBack: () => void;
  title?: string;
  style?: {
    bar?: StyleProp<ViewStyle>;
    title?: StyleProp<TextStyle>;
  };
};

const NavigationBar = ({ style, title, onBack }: Props) => {
  return (
    <View style={[styles.defaultViewStyles, style?.bar]}>
      <Typography
        size="lg"
        style={[styles.defaultTitleStyles, style?.title]}
        onPress={onBack}>
        ←
      </Typography>
      {title && (
        <Typography size="lg" style={[styles.defaultTitleStyles, style?.title]}>
          {title}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultViewStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 16,
    backgroundColor: theme.color.nav_blue,
    borderBottomColor: '#111',
    borderBottomWidth: 1,
  },
  defaultTitleStyles: {
    fontWeight: 500,
  },
});
export default NavigationBar;
