import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import userStoreApi from './userStoreApi';

const initialState: UserStore = {
  pages: -1,
  allUsers: [],
  paginatedUsers: [],
  currentUser: {
    _id: '',
    name: '',
    email: '',
    role: 'USER',
    createdAt: '',
    updatedAt: '',
    booksRead: [],
    profileImageUrl: '',
    bookmarkedBookIDs: [],
    emailValidated: false
  }
};

type PaginatedUsersResponse = PaginatedResponse | User[];
type ActionHandler<T> = CaseReducer<UserStore, PayloadAction<T>>;

const refreshAction: ActionHandler<PaginatedUsersResponse> = (state, action) => {
  const payload: PaginatedUsersResponse = action.payload;

  if ('docs' in payload) {
    // indicates paginated response
    return { ...state, paginatedUsers: payload.docs, pages: payload.pages };
  }
  return { ...state, allUsers: payload };
};

const updateAction: ActionHandler<User> = (state, { payload }) => ({
  ...state,
  currentUser: payload
});

export const userStoreSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    logout: () => initialState,
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state = Object.assign(state, {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload }
      });
    },
    updateUsers: (state, action: PayloadAction<Partial<Omit<UserStore, 'currentUser'>>>) => {
      state = Object.assign(state, { ...state, ...action.payload });
    }
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates User object globally
    builder.addMatcher(userStoreApi.endpoints.login.matchFulfilled, updateAction);
    builder.addMatcher(userStoreApi.endpoints.register.matchFulfilled, updateAction);
    builder.addMatcher(userStoreApi.endpoints.updateUser.matchFulfilled, updateAction);
    builder.addMatcher(userStoreApi.endpoints.getUsers.matchFulfilled, refreshAction);
  }
});

export const { logout, updateUser, updateUsers } = userStoreSlice.actions;
export default userStoreSlice.reducer;
