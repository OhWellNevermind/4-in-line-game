import { selectIsLoggedIn } from '@/redux/selectors/auth';
import AuthScreen from '@/screens/AuthScreen';
import HomeScreen from '@/screens/HomeScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import BoardScreen from '@/screens/BoardScreen';
import { useAppSelector } from '@/stores/hooks';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useGetMeQuery } from '@/services/authApi';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  useGetMeQuery('');

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Board" component={BoardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={AuthScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
