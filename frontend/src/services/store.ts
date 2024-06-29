/* persist our store */
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import emailApi from './apis/emailApi';
import userDataSlice from './userData/userDataSlice';
import userStoreApi from './apis/userApi/userStoreApi';
import bookStoreApi from './apis/bookApi/bookStoreApi';
import userStoreSlice from './apis/userApi/userStoreSlice';
import bookStoreSlice from './apis/bookApi/bookStoreSlice';

/* reducers */
const reducer = combineReducers({
  userData: userDataSlice,
  userStore: userStoreSlice,
  bookStore: bookStoreSlice,
  [emailApi.reducerPath]: emailApi.reducer,
  [userStoreApi.reducerPath]: userStoreApi.reducer,
  [bookStoreApi.reducerPath]: bookStoreApi.reducer
});

const persistConfig = {
  storage,
  key: 'root',
  blackList: [bookStoreApi.reducerPath, userStoreApi.reducerPath, emailApi.reducerPath]
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
    }).concat(bookStoreApi.middleware, userStoreApi.middleware, emailApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
