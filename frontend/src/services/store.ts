/* persist our store */
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import emailApi from './apis/emailApi';
import userApi from './apis/userApi/userApi';
import userSlice from './apis/userApi/userSlice';
import userDataSlice from './userData/userDataSlice';
import bookStoreApi from './apis/bookApi/bookStoreApi';
import bookStoreSlice from './apis/bookApi/bookStoreSlice';

/* reducers */
const reducer = combineReducers({
  user: userSlice,
  userData: userDataSlice,
  bookStore: bookStoreSlice,
  [userApi.reducerPath]: userApi.reducer,
  [emailApi.reducerPath]: emailApi.reducer,
  [bookStoreApi.reducerPath]: bookStoreApi.reducer
});

const persistConfig = {
  storage,
  key: 'root',
  blackList: [bookStoreApi.reducerPath, userApi.reducerPath, emailApi.reducerPath]
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
    }).concat(bookStoreApi.middleware, userApi.middleware, emailApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
