import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import contentReducer from './slices/contentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    contents: contentReducer,
  },
});

export default store;
