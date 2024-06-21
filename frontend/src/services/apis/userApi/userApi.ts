import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, LOGIN, REGISTER, USERS } = Endpoints;

// create the createApi
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    register: builder.mutation({
      query: (body: UserRegisterPayload) => ({ url: REGISTER, method: 'POST', body })
    }),
    login: builder.mutation({
      query: (user: UserLoginPayload) => ({ url: LOGIN, method: 'POST', body: user })
    }),
    updateUser: builder.mutation({
      query: (body: UserUpdatePayload) => ({ url: `${USERS}/${body._id}`, method: 'PATCH', body })
    })
  })
});

export const { useLoginMutation, useRegisterMutation } = userApi;

export default userApi;
