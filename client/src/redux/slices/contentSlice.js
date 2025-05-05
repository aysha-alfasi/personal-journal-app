import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contents: [],
  title: "",
  content_field: "",
  mood: "",
  editing: null,
};

const contentSlice = createSlice({
  name: "contents",
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
      state.contents = state.contents.filter(
        (content) => content.id !== action.payload
      );
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setContent_field: (state, action) => {
      state.content_field = action.payload;
    },
    setMood: (state, action) => {
      state.mood = action.payload;
    },
    setEditing: (state, action) => {
      state.editing = action.payload;
    },

    resetForm: (state) => {
      state.title = "";
      state.content_field = "";
      state.mood = "";
      state.editing = null;
    },
  },
});

export const {
  setContents,
  addContent,
  updateContent,
  deleteContent,
  setTitle,
  setContent_field,
  setMood,
  setEditing,
  resetForm,
} = contentSlice.actions;

export default contentSlice.reducer;
