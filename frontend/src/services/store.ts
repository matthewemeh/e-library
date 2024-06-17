/* persist our store */
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';

import userApi from './userApi/userApi';
import bookApi from './bookApi/bookApi';
import userSlice from './userApi/userSlice';
import bookSlice from './bookApi/bookSlice';

/* reducers */
const reducer = combineReducers({
  user: userSlice,
  books: bookSlice,
  [bookApi.reducerPath]: bookApi.reducer,
  [userApi.reducerPath]: userApi.reducer
});

const persistConfig = {
  storage,
  key: 'root',
  blackList: [bookApi.reducerPath, userApi.reducerPath]
};

/* persist our store */
const persistedReducer = persistReducer(persistConfig, reducer);

/* creating our store */
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
