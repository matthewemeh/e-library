import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, LOGIN, REGISTER, USERS } = Endpoints;

const USER_PAYLOAD_KEY = 'userPayload';
const PROFILE_IMAGE_KEY = 'profileImage';

// create the createApi
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL
  }),
  endpoints: builder => ({
    register: builder.mutation({
      query: (body: UserRegisterPayload) => {
        const bodyObject = { ...body };
        const { profileImage } = bodyObject;
        delete bodyObject.profileImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(PROFILE_IMAGE_KEY, profileImage as Blob);

        return { body: formData, url: REGISTER, method: 'POST' };
      }
    }),
    login: builder.mutation({
      query: (user: UserLoginPayload) => ({ url: LOGIN, method: 'POST', body: user })
    }),
    updateUser: builder.mutation({
      query: (body: UserUpdatePayload) => {
        const bodyObject = { ...body };
        const { profileImage } = bodyObject;
        delete bodyObject.profileImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(PROFILE_IMAGE_KEY, profileImage as Blob);

        return { body: formData, method: 'PATCH', url: `${USERS}/${body._id}` };
      }
    })
  })
});

export const { useLoginMutation, useRegisterMutation, useUpdateUserMutation } = userApi;

export default userApi;
