import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeScreenNavigationProp } from '@/types/types';
import Layout from '@/screens/Layout';
import Typography from '@/components/ui/Typography';
import CustomTouchableOpacityButton from '@/components/ui/CustomTouchableOpacityButton';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { selectIsLoggedIn, selectUserName } from '@/redux/selectors/auth';
import { refreshState } from '@/stores/authSlice';
import { clearTokens } from '@/helpers/clearTokens';
import UserIcon from '@/components/icons/UserIcon';

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const userName = useAppSelector(selectUserName);

  return (
    <Layout>
      {isLoggedIn ? (
        <View style={styles.userIcon}>
          <View style={styles.loggedInUser}>
            <Typography>{userName[0]}</Typography>
          </View>
        </View>
      ) : (
        <View style={styles.userIcon}>
          <UserIcon />
        </View>
      )}
      <View style={styles.logo}>
        <Typography>Logo goes here i guess</Typography>
      </View>
      <View style={styles.menu}>
        {isLoggedIn && (
          <>
            <CustomTouchableOpacityButton
              onPress={() => navigation.navigate('Board')}>
              <Typography>Board</Typography>
            </CustomTouchableOpacityButton>
            <CustomTouchableOpacityButton
              onPress={async () => {
                dispatch(refreshState());
                await clearTokens();
              }}>
              <Typography>Logout</Typography>
            </CustomTouchableOpacityButton>
          </>
        )}
        {!isLoggedIn && (
          <CustomTouchableOpacityButton
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <Typography>Login</Typography>
          </CustomTouchableOpacityButton>
        )}
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
  userIcon: {
    alignItems: 'flex-end',
  },
  loggedInUser: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#73A9FF',
    borderRadius: 100,
  },
});

export default HomeScreen;
