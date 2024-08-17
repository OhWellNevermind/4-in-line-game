import React from 'react';
import { StyleSheet, View } from 'react-native';

import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';
import NavigationBar from '@/components/ui/NavigationBar';
import Typography from '@/components/ui/Typography';
import Layout from '@/screens/Layout';
import { GameModesScreenNavigationProp } from '@/types/types';

type Props = {
  navigation: GameModesScreenNavigationProp;
};

const GameModesScreen = ({ navigation }: Props) => {
  return (
    <Layout
      navigationComponent={
        <NavigationBar
          title="Game modes"
          onBack={() => {
            navigation.navigate('Home');
          }}
        />
      }>
      <View style={styles.menuContainer}>
        <View style={styles.menu}>
          <CustomTouchableOpacityButton
            onPress={() => navigation.navigate('Board', { mode: 'online' })}>
            <Typography>Play online</Typography>
          </CustomTouchableOpacityButton>
          <CustomTouchableOpacityButton
            onPress={() =>
              navigation.navigate('Board', { mode: 'twoPlayers' })
            }>
            <Typography>Play on the same device</Typography>
          </CustomTouchableOpacityButton>
          <CustomTouchableOpacityButton
            onPress={() =>
              navigation.navigate('Board', { mode: 'offlineBot' })
            }>
            <Typography>Play against bot</Typography>
          </CustomTouchableOpacityButton>
          <CustomTouchableOpacityButton
            onPress={() =>
              navigation.navigate('Board', { mode: 'onlineRoom' })
            }>
            <Typography>Create a room</Typography>
          </CustomTouchableOpacityButton>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'column',
    gap: 32,
  },
  menuContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default GameModesScreen;
