import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/slices/userSlice";
import { useAuth } from "./hooks/useAuth";
import { useContent } from "./hooks/useContent";
import { setContents } from "./redux/slices/contentSlice";
import { setMoodStats } from "./redux/slices/moodStatsSlice";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import ContentList from "./components/journal/ContentList";
import ContentForm from "./components/journal/ContentForm";
import ContentDetails from "./components/journal/ContentDetails";
import PrivateRoute from "./components/Auth/PrivateRoute";
import ProfilePage from "./components/journal/ProfilePage";
import MoodChart from "./components/mood-chart/MoodChart";
import UserProfile from "./components/the-user-profile/UserProfile";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { contents } = useSelector((state) => state.contents);
  const moodStats = useSelector((state) => state.moodStats);
  const [loading, setLoading] = useState(true);


  const fetchMoodStatsEdit = () => {
    if (user) {
      axios
        .get(`http://localhost:5000/mood-statistics/${user.id}`, {
          withCredentials: true,
        })
        .then((response) => {
          dispatch(setMoodStats(response.data));
        })
        .catch((err) => {
          console.error("Error fetching mood stats", err);
        });
    }
  };
  

  useEffect(() => {
    if (user) {
      fetchMoodStatsEdit();
    }
  }, [user]);
  


  const {
    username,
    password,
    email,
    registering,
    setUsername,
    setPassword,
    setEmail,
    setRegistering,
    handleLogin,
    handleRegister,
    handleLogout,
  } = useAuth();
  const {
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
  } = useContent(fetchMoodStatsEdit);

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", { withCredentials: true })
      .then((response) => {
        dispatch(setUser(response.data));
      })
      .catch((error) => {
        console.log("Not logged in");
        dispatch(setUser(null)); // ♡> No user logged in
      })
      .finally(() => {
        setLoading(false);
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




  // <♡> Reset the form and stop editing <♡>

  const resetForm = () => {
    setTitle("");
    setContent_field("");
    setMood("");
    setEditing(null);
  };

  if (loading) {
    return <div>جارٍ التحميل...</div>;
  }
  

  return (
    <div className="App">
      <UserProfile user={user} handleLogout={handleLogout} />
      <Routes>
        {/* ♡ Show login or registration form  ♡ */}
        <Route
          path="/"
          element={
            !user ? (
              <div>
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
              </div>
            ) : (
              <div>
                <ProfilePage />
                {moodStats && moodStats.length > 0 && <MoodChart isDemo={false} />}
              </div>
            )
          }
        />

        <Route
          path="/content-form"
          element={
            <PrivateRoute
              element={
                <ContentForm
                  user={user}
                  handleLogout={handleLogout}
                  title={title}
                  content_field={content_field}
                  mood={mood}
                  setTitle={setTitle}
                  setContent_field={setContent_field}
                  setMood={setMood}
                  handleSubmit={handleSubmit}
                  handleEdit={handleEdit}
                  editing={editing}
                  resetForm={resetForm}
               /*    refreshMoodStats={fetchMoodStats}  */
                />
              }
              user={user}
            />
          }
        />

        <Route
          path="/content-list"
          element={
            <PrivateRoute
              element={
                <ContentList
                  contents={contents}
                  handleSubmit={handleSubmit}
                  handleDelete={handleDelete}
                />
              }
              user={user}
            />
          }
        />

        <Route
          path="/content-list/:id"
          element={
            <PrivateRoute
              element={<ContentDetails contents={contents} />}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
