import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import bookApi from './bookApi';

const initialState: Book[] = [];

export const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // updateBook: (state, action: PayloadAction<Partial<Book>>) => {
    //   state = Object.assign(state, action.payload);
    // },
    updateBooks: (_, action) => action.payload
  },
  extraReducers: builder => {
    builder.addMatcher(bookApi.endpoints.createBook.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(bookApi.endpoints.updateBook.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(bookApi.endpoints.increaseReads.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(
      bookApi.endpoints.increaseBookmarks.matchFulfilled,
      (_, { payload }) => payload
    );
  }
});

export const { updateBooks } = bookSlice.actions;
export default bookSlice.reducer;
