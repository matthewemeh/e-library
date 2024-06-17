import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, LOGIN, REGISTER } = Endpoints;

// create the createApi
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    register: builder.mutation({
      query: (user: UserRegisterPayload) => ({ url: REGISTER, method: 'POST', body: user })
    }),
    login: builder.mutation({
      query: (user: UserLoginPayload) => ({ url: LOGIN, method: 'POST', body: user })
    })
  })
});

export const { useLoginMutation, useRegisterMutation } = userApi;

export default userApi;
