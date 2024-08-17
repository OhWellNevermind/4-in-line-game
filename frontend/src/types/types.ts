import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Board: undefined;
  Login: undefined;
  Register: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type BoardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Board'
>;

export type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type AsyncStorageKeys = 'token' | 'refreshToken';
