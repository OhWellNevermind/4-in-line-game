import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoardScreen from '@/screens/BoardScreen';
import HomeScreen from '@/screens/HomeScreen';
import AuthScreen from '@/screens/AuthScreen';
import { Provider } from 'react-redux';
import { store } from '@/stores/store';
import GameModesScreen from '@/screens/GameModesScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Board" component={BoardScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="GameModes" component={GameModesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
export default App;
