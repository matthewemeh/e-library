import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserData = {
  booksReadInfo: [],
  bookmarkedBookIDs: [],
  isAuthenticated: false,
  prefersDarkMode: false,
  previouslyBookmarkedBookIDs: []
};

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      state = Object.assign(state, action.payload);
    }
  }
});

export const { updateUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
