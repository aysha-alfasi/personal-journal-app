import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/slices/userSlice";
import { useAuth } from './hooks/useAuth';
import { useContent } from "./hooks/useContent";
import { setContents } from "./redux/slices/contentSlice";
import Login from "./components/Auth/Login";
import UserProfile from "./components/the-user-profile/UserProfile";
import ContentForm from "./components/journal/ContentForm";
import ContentList from "./components/journal/ContentList";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { contents } = useSelector((state) => state.contents);
  const { username, password, email, registering, setUsername, setPassword, setEmail, setRegistering, handleLogin, handleRegister, handleLogout } = useAuth();
  const { title, content_field, mood, editing, setTitle, setContent_field, setMood, setEditing, handleSubmit, handleEdit, handleDelete } = useContent();


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


  // <♡> handle login <♡>


  // <♡> handle logout <♡>


  // <♡> handle add contnet <♡>



  // <♡> Handle edit content <♡>

  // <♡> Reset the form and stop editing <♡>

  const resetForm = () => {
    setTitle("");
    setContent_field("");
    setMood("");
    setEditing(null);
  };

  // <♡> Handle delete content <♡>


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
