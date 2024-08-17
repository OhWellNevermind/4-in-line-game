import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig, AxiosError } from 'axios';
import axiosInstance from './instance'; // Import the instance with interceptors

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig['method'];
  body?: any;
  params?: any;
  headers?: any;
};

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl?: string } = { baseUrl: '' },
  ): BaseQueryFn<AxiosBaseQueryArgs | string, unknown, unknown> =>
  async args => {
    if (typeof args === 'string') {
      try {
        const result = await axiosInstance({
          url: baseUrl + args,
        });
        return { data: result.data };
      } catch (axiosError) {
        let err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    }
    const { url, method, params, headers, body } = args;
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
