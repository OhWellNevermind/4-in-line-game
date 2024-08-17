import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type GameModes = 'twoPlayers' | 'online' | 'onlineRoom' | 'offlineBot';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Board: {
    mode: GameModes;
  };
  Auth: undefined;
  GameModes: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type BoardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Board'
>;

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;

export type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type AsyncStorageKeys = 'token' | 'refreshToken';
export type GameModesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GameModes'
>;
