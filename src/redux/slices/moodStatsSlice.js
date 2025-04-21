import { createSlice } from "@reduxjs/toolkit";

const moodStatsSlice = createSlice({
  name: "moodStats",
  initialState: [],
  reducers: {
    setMoodStats: (state, action) => {
      return action.payload;
    },
    clearMoodStats: () => {
      return [];
    },
  },
});

export const { setMoodStats, clearMoodStats } = moodStatsSlice.actions;
export default moodStatsSlice.reducer;
