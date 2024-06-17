import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, BOOKS, INCREASE_BOOKMARKS, INCREASE_READS } = Endpoints;

// create the createApi
export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    createBook: builder.mutation({
      query: (book: AddBookPayload) => ({ url: BOOKS, method: 'POST', body: book })
    }),
    updateBook: builder.mutation({
      query: (book: UpdateBookPayload) => ({
        body: book,
        url: BOOKS,
        method: 'PATCH',
        params: { id: book._id }
      })
    }),
    increaseReads: builder.mutation({
      query: (body: { _id: string }) => ({
        method: 'POST',
        url: INCREASE_READS,
        params: { id: body._id }
      })
    }),
    increaseBookmarks: builder.mutation({
      query: (body: { _id: string }) => ({
        method: 'POST',
        url: INCREASE_BOOKMARKS,
        params: { id: body._id }
      })
    })
  })
});

export const {
  useCreateBookMutation,
  useUpdateBookMutation,
  useIncreaseReadsMutation,
  useIncreaseBookmarksMutation
} = bookApi;

export default bookApi;
