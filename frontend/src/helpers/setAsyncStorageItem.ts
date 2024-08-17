import { AsyncStorageKeys } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsyncStorageItem = async (
  item: Partial<{
    [key in AsyncStorageKeys]: string;
  }>,
) => {
  Object.keys(item).forEach(
    async key =>
      await AsyncStorage.setItem(key, item[key as AsyncStorageKeys]!),
  );
};
