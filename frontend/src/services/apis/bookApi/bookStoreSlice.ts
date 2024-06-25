import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import bookStoreApi from './bookStoreApi';

const initialState: BookStore = { paginatedBooks: [], pages: -1, allBooks: [] };

type PaginatedBooksResponse = PaginatedResponse | Book[];
type ActionHandler<T> = CaseReducer<BookStore, PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedBooksResponse> = (state, action) => {
  const payload: PaginatedBooksResponse = action.payload;

  if ('docs' in payload) {
    // indicates paginated response
    return { ...state, paginatedBooks: payload.docs, pages: payload.pages };
  }
  return { ...state, allBooks: payload };
};

const updateAction: ActionHandler<Book> = (state, action) => {
  const bookToUpdateID: string = action.payload._id;

  const newBooks = [...state.allBooks];
  const newPaginatedBooks = [...state.paginatedBooks];

  const newBookToUpdateIndex: number = newBooks.findIndex(({ _id }) => _id === bookToUpdateID);
  const paginatedBookToUpdateIndex: number = newPaginatedBooks.findIndex(
    ({ _id }) => _id === bookToUpdateID
  );

  const newBookToUpdateFound: boolean = newBookToUpdateIndex > -1;
  const paginatedBookToUpdateFound: boolean = paginatedBookToUpdateIndex > -1;

  if (paginatedBookToUpdateFound && newBookToUpdateFound) {
    newPaginatedBooks[paginatedBookToUpdateIndex] = action.payload;
    newBooks[newBookToUpdateIndex] = action.payload;
    return { ...state, paginatedBooks: newPaginatedBooks, allBooks: newBooks };
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
