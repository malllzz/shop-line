import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("access_token") !== null;

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
