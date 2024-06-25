import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';
import Constants from '../../../Constants';

const { BASE_URL, INCREASE_BOOKMARKS, INCREASE_READS, BOOKS } = Endpoints;

const { COVER_IMAGE_KEY, IMAGE_CONTENTS_KEY, USER_PAYLOAD_KEY } = Constants;

// create the createApi
export const bookStoreApi = createApi({
  reducerPath: 'bookStoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    createBook: builder.mutation({
      query: (body: AddBookPayload) => {
        const bodyObject = { ...body };
        const { coverImageContent, imageContents, params } = bodyObject;
        delete bodyObject.imageContents;
        delete bodyObject.coverImageContent;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(IMAGE_CONTENTS_KEY, imageContents as unknown as Blob);
        formData.append(COVER_IMAGE_KEY, coverImageContent as Blob);

        return { url: BOOKS, body: formData, method: 'POST', params };
      }
    }),
    updateBook: builder.mutation({
      query: (body: UpdateBookPayload) => {
        const bodyObject = { ...body };
        const { coverImageContent, imageContents, params } = bodyObject;
        delete bodyObject.imageContents;
        delete bodyObject.coverImageContent;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(IMAGE_CONTENTS_KEY, imageContents as unknown as Blob);
        formData.append(COVER_IMAGE_KEY, coverImageContent as Blob);

        return { body: formData, method: 'PATCH', params, url: `${BOOKS}/${body._id}` };
      }
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
