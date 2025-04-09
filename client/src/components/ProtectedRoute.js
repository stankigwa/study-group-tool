// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

// A helper function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token ? true : false; // Return true if the token exists, false otherwise
};

const ProtectedRoute = ({ element, ...rest }) => {
  // If the user is authenticated, render the element (page). Otherwise, redirect to login.
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" /> // Redirect to login page if not authenticated
  );
};

export default ProtectedRoute;
