import { theme } from '@/utils/consts/theme';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
  navigationComponent?: React.ReactNode;
};

const Layout = ({ children, navigationComponent }: Props) => {
  return (
    <>
      {navigationComponent}
      <SafeAreaView style={styles.wrapper}>{children}</SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    padding: 20,
    backgroundColor: theme.color.bg_blue,
  },
});

export default Layout;
