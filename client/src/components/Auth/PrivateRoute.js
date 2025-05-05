import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ element, user }) {
  return user ? element : <Navigate to="/" />;
}

export default PrivateRoute;
