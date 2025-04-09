import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // New state for success messages
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data on component mount
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
    } else {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/user/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch user data", err);
          setError("Error loading profile");
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/user/profile",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Profile updated successfully!"); // Set success message
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error updating profile", err);
      setError("Error updating profile");
      setSuccess(null); // Clear any previous success
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700">Edit Profile</h2>

      {/* Display success message */}
      {success && (
        <p className="text-green-600 mb-4 font-semibold">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
