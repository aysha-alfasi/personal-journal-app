// hooks/useAuth.js
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../redux/slices/userSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [registering, setRegistering] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        { username, password },
        { withCredentials: true }
      );
      dispatch(setUser(response.data));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, {
        username,
        email,
        password,
      }, { withCredentials: true });
      dispatch(setUser(response.data));
      setUsername("");
      setEmail("");
      setPassword("");
      setRegistering(false);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return {
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
  };
}
