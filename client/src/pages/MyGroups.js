import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";

// CSS for the loading spinner
const loadingSpinnerStyle = {
  display: "inline-block",
  width: "50px",
  height: "50px",
  border: "5px solid #f3f3f3", // Light grey background
  borderTop: "5px solid #3498db", // Blue color for the spinner
  borderRadius: "50%",
  animation: "spin 2s linear infinite",
};

const MyGroups = () => {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGroups, setTotalGroups] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data with pagination
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get user and joined groups
        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userGroups = userRes.data.user.studyGroups || [];
        setUser(userRes.data.user);
        setGroups(userGroups);

        // Get available groups with pagination and search term
        const searchQuery = searchTerm ? `&search=${searchTerm}` : "";
        const availableGroupsRes = await axios.get(
          `http://localhost:5000/api/study-groups/available?page=${currentPage}&limit=10${searchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const available = availableGroupsRes.data.studyGroups;
        setAvailableGroups(available);
        setTotalGroups(availableGroupsRes.data.total);  // Set total groups count
        setTotalPages(Math.ceil(availableGroupsRes.data.total / 10));  // Calculate total pages based on limit (10)
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, currentPage]); // Re-fetch data when searchTerm or currentPage changes

  // Handle joining a group
  const handleJoinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/api/study-groups/${groupId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const joinedGroup = response.data.studyGroup;

      // Update UI
      setGroups([...groups, joinedGroup]);
      setAvailableGroups(availableGroups.filter(g => g._id !== groupId));
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        name: user.name,
        email: user.email,
      };
      const response = await axios.put(
        "http://localhost:5000/api/users/me",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.user);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  // Handle promoting to admin
  const handlePromoteToAdmin = async (groupId, userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/study-groups/${groupId}/promote`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User promoted to admin");
      setGroups(groups.map(group =>
        group._id === groupId ? { ...group, admins: [...group.admins, userId] } : group
      ));
    } catch (error) {
      console.error("Error promoting user:", error);
      alert("Failed to promote user");
    }
  };

  // Pagination control
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return (
    <div className="p-6 flex justify-center items-center">
      <div style={loadingSpinnerStyle}></div> {/* Loading Spinner */}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 My Study Groups</h1>

      {/* Profile Update Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Update Your Profile</h2>
        {isEditing ? (
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={user?.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={user?.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                disabled
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <p className="mb-2">Name: {user?.name}</p>
            <p className="mb-4">Email: {user?.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search study groups..."
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {/* Groups Section */}
      {groups.length === 0 ? (
        <p className="text-center text-gray-600">You're not part of any groups yet.</p>
      ) : (
        <div className="grid gap-4 mb-10">
          {groups.map(group => (
            <div key={group._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-blue-600">
                {/* Link to GroupDetails */}
                <Link to={`/groups/${group._id}`} className="hover:underline">
                  {group.name}
                </Link>
              </h2>
              <p className="text-gray-700">{group.description}</p>
              <p className="text-sm text-gray-500 mt-1">Members: {group.members?.length || 0}</p>

              {group.admins.includes(user._id) && (
                <div className="mt-4">
                  <button
                    onClick={() => handlePromoteToAdmin(group._id, user._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Promote to Admin
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4 text-center text-green-600">➕ Available Study Groups</h2>

      {availableGroups.length === 0 ? (
        <p className="text-center text-gray-500">No more groups available to join.</p>
      ) : (
        <div className="grid gap-4">
          {availableGroups.map(group => (
            <div key={group._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{group.name}</h2>
              <p className="text-gray-700">{group.description}</p>
              <button
                onClick={() => handleJoinGroup(group._id)}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Join Group
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-4 text-lg text-gray-700">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyGroups;
