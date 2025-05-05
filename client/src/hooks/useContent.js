// hooks/useContent.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addContent,
  updateContent,
  deleteContent,
  setEditing,
} from "../redux/slices/contentSlice";
import axios from "axios";

export function useContent(refreshMoodStats) {
  const dispatch = useDispatch();
  const { editing } = useSelector((state) => state.contents); // احصل على الـ editing من Redux
  const [title, setTitle] = useState("");
  const [content_field, setContent_field] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = async (updatedContent) => {
    try {
      if (editing) {
        const response = await axios.put(
          `http://localhost:5000/contents/${editing}`,
          updatedContent,
          { withCredentials: true }
        );
        dispatch(updateContent(response.data));
        if (refreshMoodStats) {
          refreshMoodStats();
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/contents",
          updatedContent,
          { withCredentials: true }
        );
        dispatch(addContent(response.data));
        if (refreshMoodStats) {
          refreshMoodStats();
        }
      }
    } catch (error) {
      console.error("Error submitting entry", error);
    } finally {
      setTitle("");
      setContent_field("");
      setMood("");
      dispatch(setEditing(null));
    }
  };

  const handleEdit = (content) => {
    setTitle(content.title);
    setContent_field(content.content_field);
    setMood(content.mood);
    setEditing(content.id);
    dispatch(setEditing(content.id));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this content?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/contents/${id}`, {
          withCredentials: true,
        });
        dispatch(deleteContent(id));
        if (refreshMoodStats) {
          refreshMoodStats(); 
        }
      } catch (error) {
        console.error("Error deleting entry", error);
      }
    }
  };

  return {
    title,
    content_field,
    mood,
    editing,
    setTitle,
    setContent_field,
    setMood,
    setEditing,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
}
