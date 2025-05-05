import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import contentReducer from './slices/contentSlice';
import moodStatsReducer from './slices/moodStatsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    contents: contentReducer,
    moodStats: moodStatsReducer,
  },
});

export default store;
