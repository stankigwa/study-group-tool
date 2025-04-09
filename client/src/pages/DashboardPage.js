import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // Initialize navigate function

  // Fetch the user data from the backend (protected route)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/protected/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,  // Attach the token to the Authorization header
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch((error) => console.log("Error fetching profile:", error));
    }
  }, []);

  // Logout handler
  const logoutHandler = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, {user.email}! You are logged in.</p>
          {/* Logout button */}
          <button onClick={logoutHandler}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardPage;
