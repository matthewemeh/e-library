import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, INCREASE_BOOKMARKS, INCREASE_READS, BOOKS } = Endpoints;

// create the createApi
export const bookStoreApi = createApi({
  reducerPath: 'bookStoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    createBook: builder.mutation({
      query: (body: AddBookPayload) => ({
        body,
        url: BOOKS,
        method: 'POST',
        params: body.params
      })
    }),
    updateBook: builder.mutation({
      query: (body: UpdateBookPayload) => ({
        body,
        method: 'PATCH',
        params: body.params,
        url: `${BOOKS}/${body._id}`
      })
    }),
    deleteBook: builder.mutation({
      query: (body: DeleteBookPayload) => ({
        body,
        method: 'DELETE',
        params: body.params,
        url: `${BOOKS}/${body._id}`
      })
    }),
    getBooks: builder.mutation({
      query: (body: GetBooksPayload) => ({ method: 'GET', url: BOOKS, params: body.params })
    }),
    increaseReads: builder.mutation({
      query: (body: { _id: string }) => ({ method: 'POST', url: `${INCREASE_READS}/${body._id}` })
    }),
    increaseBookmarks: builder.mutation({
      query: (body: { _id: string }) => ({
        method: 'POST',
        url: `${INCREASE_BOOKMARKS}/${body._id}`
      })
    })
  })
});

export const {
  useGetBooksMutation,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useIncreaseReadsMutation,
  useIncreaseBookmarksMutation
} = bookStoreApi;

export default bookStoreApi;
