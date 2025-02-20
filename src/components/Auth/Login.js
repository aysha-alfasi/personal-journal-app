import React from "react";
import { Button } from "antd";
import "./Login.css";

function Login({
  isRegistering,
  handleSubmit,
  handleChange,
  username,
  email,
  password,
  toggleForm,
}) {
  return (
    <div className="wrapper">
      {/* <h2>{isRegistering ? "Register" : "Login to Start"}</h2> */}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="custom-input"
          type="text"
          value={username}
          onChange={handleChange("username")}
          placeholder="Username"
          required
        />
        {isRegistering && (
          <input
            className="custom-input"
            type="text"
            value={email}
            onChange={handleChange("email")}
            placeholder="Email"
            required
          />
        )}
        <input
          className="custom-input"
          type="password"
          value={password}
          onChange={handleChange("password")}
          placeholder="Password"
          required
        />
        <Button className="custom-button" htmlType="submit">
          {isRegistering ? "Register" : "Login"}
        </Button>
      </form>
      <Button className="link-button" onClick={toggleForm}>
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </Button>
    </div>
  );
}

export default Login;
