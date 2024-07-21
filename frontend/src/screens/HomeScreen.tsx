import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeScreenNavigationProp } from '@/types/types';
import Layout from '@/screens/Layout';
import Typography from '@/components/ui/Typography';
import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  return (
    <Layout>
      <View style={styles.logo}>
        <Typography>Logo goes here i guess</Typography>
      </View>
      <View style={styles.menu}>
        <CustomTouchableOpacityButton
          onPress={() => navigation.navigate('Board')}>
          <Typography>Board</Typography>
        </CustomTouchableOpacityButton>
        <CustomTouchableOpacityButton
          onPress={() => navigation.navigate('Auth')}>
          <Typography>Login</Typography>
        </CustomTouchableOpacityButton>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginVertical: 150,
    marginHorizontal: 'auto',
  },
  menu: {
    flexDirection: 'column',
    gap: 32,
  },
});

export default HomeScreen;
