import { createApi } from '@reduxjs/toolkit/query/react';
import { TLoginDTO, TRegisterDTO } from '@/types/dtos';
import axiosBaseQuery from './axiosBaseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({ baseUrl: 'http://10.0.2.2:5000' }),
  endpoints: builder => ({
    login: builder.mutation({
      query: (body: TLoginDTO) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation({
      query: (body: TRegisterDTO) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/get-me',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
