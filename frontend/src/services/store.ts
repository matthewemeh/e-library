/* persist our store */
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import userApi from './apis/userApi/userApi';
import bookApi from './apis/bookApi/bookApi';
import userSlice from './apis/userApi/userSlice';
import bookSlice from './apis/bookApi/bookSlice';
import userDataSlice from './userData/userDataSlice';

/* reducers */
const reducer = combineReducers({
  user: userSlice,
  books: bookSlice,
  userData: userDataSlice,
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
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(bookApi.middleware, userApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
