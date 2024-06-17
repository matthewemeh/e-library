import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userApi from './userApi';

const initialState: User & UserData = {
  _id: '',
  name: '',
  email: '',
  role: 'USER',
  createdAt: '',
  updatedAt: '',
  booksReadInfo: [],
  profileImageUrl: '',
  bookmarkedBookIDs: [],
  emailValidated: false,
  isAuthenticated: false,
  prefersDarkMode: false,
  previouslyBookmarkedBookIDs: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state = Object.assign(state, action.payload);
    },
    logout: () => initialState
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates User object globally
    builder.addMatcher(userApi.endpoints.register.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, (_, { payload }) => payload);
  }
});

export const { logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
