import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Remove the token from localStorage (you can adjust this depending on how you store the token)
    localStorage.removeItem("token");

    // Redirect the user to the login page after logging out
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          StudySync
        </Link>

        <div className="space-x-6">
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/my-groups" className="hover:text-gray-300">
            My Groups
          </Link>
          <Link to="/study-groups" className="hover:text-gray-300">
            Available Groups
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
