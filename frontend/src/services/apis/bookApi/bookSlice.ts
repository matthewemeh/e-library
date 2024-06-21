import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import bookApi from './bookApi';

const initialState: Book[] = [];

type PaginatedBooksResponse = PaginatedResponse | Book[];
type ActionHandler<T> = CaseReducer<Book[], PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedBooksResponse> = (_, action) => {
  const payload: PaginatedBooksResponse = action.payload;
  return 'docs' in payload ? payload.docs : payload;
};

const updateAction: ActionHandler<Book> = (state, action) => {
  const bookToUpdateID: string = action.payload._id;
  const newBooks = state;
  const bookToUpdateIndex: number = newBooks.findIndex(({ _id }) => _id === bookToUpdateID);
  const bookToUpdateFound: boolean = bookToUpdateIndex > -1;
  if (bookToUpdateFound) {
    newBooks[bookToUpdateIndex] = action.payload;
    return newBooks;
  }
  return state;
};

export const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    updateBooks: (_, action: PayloadAction<Book[]>) => action.payload
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates Books object globally
    builder.addMatcher(bookApi.endpoints.getBooks.matchFulfilled, refreshAction);
    builder.addMatcher(bookApi.endpoints.createBook.matchFulfilled, refreshAction);
    builder.addMatcher(bookApi.endpoints.updateBook.matchFulfilled, refreshAction);
    builder.addMatcher(bookApi.endpoints.deleteBook.matchFulfilled, refreshAction);
    builder.addMatcher(bookApi.endpoints.increaseReads.matchFulfilled, updateAction);
    builder.addMatcher(bookApi.endpoints.increaseBookmarks.matchFulfilled, updateAction);
  }
});

export const { updateBooks } = bookSlice.actions;
export default bookSlice.reducer;
