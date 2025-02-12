import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contents: [],
};

const contentSlice = createSlice({
  name: 'contents',
  initialState,
  reducers: {
    setContents: (state, action) => {
      state.contents = action.payload;
    },
    addContent: (state, action) => {
      state.contents = [action.payload, ...state.contents];
    },
    updateContent: (state, action) => {
      const updatedContents = state.contents.map((content) =>
        content.id === action.payload.id ? action.payload : content
      );
      state.contents = updatedContents;
    },
    deleteContent: (state, action) => {
      state.contents = state.contents.filter((content) => content.id !== action.payload);
    },
  },
});

export const { setContents, addContent, updateContent, deleteContent } = contentSlice.actions;

export default contentSlice.reducer;
