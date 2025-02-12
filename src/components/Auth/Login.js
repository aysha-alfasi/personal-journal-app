import React from "react";

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
    <div>
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleChange("username")}
          placeholder="Username"
          required
        />
        {isRegistering && (
          <input
            type="text"
            value={email}
            onChange={handleChange("email")}
            placeholder="Email"
            required
          />
        )}
        <input
          type="password"
          value={password}
          onChange={handleChange("password")}
          placeholder="Password"
          required
        />
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>
      <button onClick={toggleForm}>
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
    </div>
  );
}

export default Login;
