import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "./redux/slices/userSlice";
import {
  setContents,
  addContent,
  updateContent,
  deleteContent,
} from "./redux/slices/contentSlice";
import { useNavigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import UserProfile from "./components/the-user-profile/UserProfile";
import ContentForm from "./components/journal/ContentForm";
import ContentList from "./components/journal/ContentList";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { contents } = useSelector((state) => state.contents);

  const [title, setTitle] = useState("");
  const [content_field, setContent_field] = useState("");
  const [mood, setMood] = useState("");
  const [editing, setEditing] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", { withCredentials: true })
      .then((response) => {
        dispatch(setUser(response.data));
      })
      .catch((error) => {
        console.log("Not logged in");
        dispatch(setUser(null)); // ♡> No user logged in
      });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/contents/${user.id}`, {
          withCredentials: true,
        })
        .then((response) => {
          dispatch(setContents(response.data)); // ♡> Set the content for the logged-in user
        })
        .catch((error) => {
          console.log("Error fetching content", error);
        });
    }
  }, [user, dispatch]);

  // <♡> Handle user registration <♡>

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/register", { username, email, password })
      .then((response) => {
        console.log("User registered:", response.data);
        dispatch(setUser(response.data)); // ♡> Set logged-in user data
        setUsername("");
        setEmail("");
        setPassword("");
        setRegistering(false); // ♡> Switch to login form after successful registration
      })
      .catch((error) => {
        console.error("Registration failed", error);
      });
  };

  // <♡> handle login <♡>

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/login",
        { username, password },
        { withCredentials: true }
      )
      .then((response) => {
        dispatch(setUser(response.data)); //♡ > Set logged-in user data
        setUsername("");
        setPassword("");
      })
      .catch((error) => {
        console.error("Login failed", error);
      });
  };

  // <♡> handle logout <♡>

  const handleLogout = () => {
    console.log("Logout request received");
    axios
      .get("http://localhost:5000/logout", { withCredentials: true })
      .then(() => {
        dispatch(logout()); //♡ > Reset user state to indicate the user is logged out
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  // <♡> handle add contnet <♡>

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { title, content_field, mood };

    if (editing) {
      axios
        .put(`http://localhost:5000/contents/${editing}`, newEntry, {
          withCredentials: true,
        })
        .then((response) => {
          dispatch(updateContent(response.data));
          resetForm();
        })
        .catch((error) => {
          console.error("Error editing entry", error);
        });
    } else {
      //♡ > Send a POST request to the backend to add the new journal
      axios
        .post("http://localhost:5000/contents", newEntry, {
          withCredentials: true,
        })
        .then((response) => {
          dispatch(addContent(response.data));
          resetForm();
        })
        .catch((error) => {
          console.error("Error submitting entry", error);
        });
    }
  };

  // <♡> Handle edit content <♡>

  const handleEdit = (content) => {
    setTitle(content.title);
    setContent_field(content.content_field);
    setMood(content.mood);
    setEditing(content.id); //♡ > Set the content being edited
  };

  // <♡> Reset the form and stop editing <♡>

  const resetForm = () => {
    setTitle("");
    setContent_field("");
    setMood("");
    setEditing(null);
  };

  // <♡> Handle delete content <♡>

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this content?"
    );
    if (confirmDelete) {
      // ♡> Make DELETE request to backend
      axios
        .delete(`http://localhost:5000/contents/${id}`, {
          withCredentials: true,
        })
        .then(() => {
          // ♡> Update the front-end
          dispatch(deleteContent(id));
        })
        .catch((error) => {
          console.error("Error deleting entry", error);
        });
    }
  };

  return (
    <div>
      <h1>Journal Contents</h1>
      {/* ♡ Show login or registration form  ♡ */}
      {!user ? (
        <Login
          isRegistering={registering}
          handleSubmit={registering ? handleRegister : handleLogin}
          handleChange={(field) => (e) => {
            if (field === "username") setUsername(e.target.value);
            if (field === "email") setEmail(e.target.value);
            if (field === "password") setPassword(e.target.value);
          }}
          username={username}
          email={email}
          password={password}
          toggleForm={() => setRegistering(!registering)}
        />
      ) : (
        <div>
          <UserProfile user={user} handleLogout={handleLogout} />
          <ContentForm
            title={title}
            content_field={content_field}
            mood={mood}
            setTitle={setTitle}
            setContentField={setContent_field}
            setMood={setMood}
            handleSubmit={handleSubmit}
            editing={editing}
            resetForm={resetForm}
          />
          <ContentList
            contents={contents}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

export default App;
