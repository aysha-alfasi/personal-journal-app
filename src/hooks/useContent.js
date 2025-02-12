// hooks/useContent.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addContent,
  updateContent,
  deleteContent,
} from "../redux/slices/contentSlice";
import axios from "axios";

export function useContent() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content_field, setContent_field] = useState("");
  const [mood, setMood] = useState("");
  const [editing, setEditing] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = { title, content_field, mood };

    try {
      if (editing) {
        const response = await axios.put(
          `http://localhost:5000/contents/${editing}`,
          newEntry,
          { withCredentials: true }
        );
        dispatch(updateContent(response.data));
      } else {
        const response = await axios.post(
          "http://localhost:5000/contents",
          newEntry,
          { withCredentials: true }
        );
        dispatch(addContent(response.data));
      }
    } catch (error) {
      console.error("Error submitting entry", error);
    } finally {
      setTitle("");
      setContent_field("");
      setMood("");
      setEditing(null);
    }
  };

  const handleEdit = (content) => {
    setTitle(content.title);
    setContent_field(content.content_field);
    setMood(content.mood);
    setEditing(content.id);
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
