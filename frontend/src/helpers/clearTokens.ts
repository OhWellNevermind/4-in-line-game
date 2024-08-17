import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearTokens = async () => {
  await AsyncStorage.setItem('token', '');
  await AsyncStorage.setItem('refreshToken', '');
};
