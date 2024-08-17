import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItemFromAsyncStore = async (key: string) => {
  return await AsyncStorage.getItem(key);
};
