import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import bookStoreApi from './bookStoreApi';

const initialState: BookStore = { books: [], pages: -1 };

type PaginatedBooksResponse = PaginatedResponse | Book[];
type ActionHandler<T> = CaseReducer<BookStore, PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedBooksResponse> = (_, action) => {
  const payload: PaginatedBooksResponse = action.payload;

  if ('docs' in payload) {
    return { books: payload.docs, pages: payload.pages };
  }
  return { books: payload, pages: -1 };
};

const updateAction: ActionHandler<Book> = (state, action) => {
  const bookToUpdateID: string = action.payload._id;
  const newBooks = [...state.books];
  const bookToUpdateIndex: number = newBooks.findIndex(({ _id }) => _id === bookToUpdateID);
  const bookToUpdateFound: boolean = bookToUpdateIndex > -1;
  if (bookToUpdateFound) {
    newBooks[bookToUpdateIndex] = action.payload;
    return { ...state, books: newBooks };
  }
  return state;
};

export const bookStoreSlice = createSlice({
  name: 'bookStore',
  initialState,
  reducers: {
    updateBooks: (_, action: PayloadAction<BookStore>) => action.payload
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates Books object globally
    builder.addMatcher(bookStoreApi.endpoints.getBooks.matchFulfilled, refreshAction);
    builder.addMatcher(bookStoreApi.endpoints.createBook.matchFulfilled, refreshAction);
    builder.addMatcher(bookStoreApi.endpoints.updateBook.matchFulfilled, refreshAction);
    builder.addMatcher(bookStoreApi.endpoints.deleteBook.matchFulfilled, refreshAction);
    builder.addMatcher(bookStoreApi.endpoints.increaseReads.matchFulfilled, updateAction);
    builder.addMatcher(bookStoreApi.endpoints.increaseBookmarks.matchFulfilled, updateAction);
  }
});

export const { updateBooks } = bookStoreSlice.actions;
export default bookStoreSlice.reducer;
