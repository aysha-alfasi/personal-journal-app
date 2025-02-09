import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function App() {

  const [contents, setContents] = useState([]);
  const [title, setTitle] = useState("");
  const [content_field, setContent_field] = useState("");
  const [mood, setMood] = useState("");
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(null); // ♡> Track the logged-in user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState('');
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log("Not logged in");
        setUser(null); // ♡> No user logged in
      });
  }, []);


  useEffect(() => {
  if (user) {
    axios
      .get(`http://localhost:5000/contents/${user.id}`, { withCredentials: true })
      .then((response) => {
        setContents(response.data);  // ♡> Set the content for the logged-in user
      })
      .catch((error) => {
        console.log("Error fetching content", error);
      });
  }
}, [user]);


// <♡> Handle user registration <♡>

const handleRegister = (e) => {
  e.preventDefault();
  axios.post('http://localhost:5000/register', { username, email, password })
    .then(response => {
      console.log('User registered:', response.data);
      setUser(response.data);  // ♡> Set logged-in user data
      setUsername('');
      setEmail('');
      setPassword('');
      setRegistering(false);  // ♡> Switch to login form after successful registration
    })
    .catch(error => {
      console.error('Registration failed', error);
    });
};


    // <♡> handle login <♡>

    const handleLogin = (e) => {
      e.preventDefault();
      axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true })
        .then(response => {
          setUser(response.data);  //♡ > Set logged-in user data
          setUsername('');
          setPassword('');
        })
        .catch(error => {
          console.error('Login failed', error);
        });
    };

    // <♡> handle logout <♡>

const handleLogout = () => {
  console.log("Logout request received");
  axios
    .get("http://localhost:5000/logout", { withCredentials: true })
    .then(() => {
      setUser(null); //♡ > Reset user state to indicate the user is logged out
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
        .put(`http://localhost:5000/contents/${editing}`, newEntry,  { withCredentials: true })
        .then((response) => {
          const updatedContents = contents.map((content) =>
            content.id === editing ? response.data : content
          );
          setContents(updatedContents);
          resetForm();
        })
        .catch((error) => {
          console.error("Error editing entry", error);
        });
    } else { //♡ > Send a POST request to the backend to add the new journal
      axios
        .post("http://localhost:5000/contents", newEntry,  { withCredentials: true })
        .then((response) => {
          setContents([response.data, ...contents]);
          setTitle("");
          setContent_field("");
          setMood("");
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
        .delete(`http://localhost:5000/contents/${id}`, { withCredentials: true })
        .then(() => {
          // ♡> Update the front-end
          setContents(contents.filter((content) => content.id !== id));
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
      <div>
        {/* ♡ Toggle between login and registration ♡ */}
        {registering ? (
          <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit">Register</button>
            </form>
            <button onClick={() => setRegistering(false)}>Already have an account? Login</button>
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit">Login</button>
            </form>
            <button onClick={() => setRegistering(true)}>Don't have an account? Register</button>
          </div>
        )}
      </div>
    ) : (
      <div>
        <h2>Welcome, {user.username}</h2>
        <button onClick={handleLogout}>Logout</button>
        {/* ♡ Form for add & edit content ♡ */}
        <h2>{editing ? 'Edit Entry' : 'Add New Entry'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={content_field}
            onChange={(e) => setContent_field(e.target.value)}
            placeholder="Write your journal..."
            required
          />
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
          >
            <option value="">Select Mood</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="neutral">Neutral</option>
            <option value="excited">Excited</option>
            <option value="angry">Angry</option>
          </select>
          <button type="submit">{editing ? 'Update Entry' : 'Submit Entry'}</button>
          {editing && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>

        {/* ♡ Display user's journal ♡ */}
        <ul>
          {contents.map(content => (
            <li key={content.id}>
              <h3>{content.title}</h3>
              <p>{content.content_field}</p>
              <small>{content.mood}</small>
              <button onClick={() => handleEdit(content)}>Edit</button>
              <button onClick={() => handleDelete(content.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
  );
}

export default App;