import axiosInstance from './instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshState } from '@/stores/authSlice';

const setup = (store: any) => {
  axiosInstance.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        // eslint-disable-next-line dot-notation
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const { dispatch } = store;
  axiosInstance.interceptors.response.use(
    res => {
      return res;
    },
    async err => {
      const originalConfig = err.config;

      if (originalConfig.url !== '/auth/login' && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const res = await axiosInstance.post('/auth/refresh', {
              refreshToken: await AsyncStorage.getItem('refreshToken'),
            });

            const { token } = res.data;

            await AsyncStorage.setItem('token', token);

            return axiosInstance(originalConfig);
          } catch (_error) {
            dispatch(refreshState());
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    },
  );
};

export default setup;
