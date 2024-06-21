import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import userApi from './userApi';

const initialState: User = {
  _id: '',
  name: '',
  email: '',
  role: 'USER',
  createdAt: '',
  updatedAt: '',
  profileImageUrl: '',
  emailValidated: false
};

type ActionHandler<T> = CaseReducer<User, PayloadAction<T>>;

const updateAction: ActionHandler<User> = (_, { payload }) => payload;

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
    builder.addMatcher(userApi.endpoints.register.matchFulfilled, updateAction);
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, updateAction);
    builder.addMatcher(userApi.endpoints.updateUser.matchFulfilled, updateAction);
  }
});

export const { logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
