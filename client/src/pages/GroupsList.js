import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch all groups wrapped in useCallback to avoid recreation on every render
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch groups", err);
      setError("An error occurred while fetching groups.");
      setLoading(false);
    }
  }, [token]); // Only recreate the function when 'token' changes

  // Fetch groups when the component mounts
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]); // Now it's safe to include fetchGroups as a dependency

  const handleViewGroupDetails = (id) => {
    navigate(`/groups/${id}`); // Navigate to group details page
  };

  const handleJoinGroup = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/groups/${id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully joined the group!");
      fetchGroups(); // Re-fetch groups to update the list
    } catch (err) {
      console.error("Error joining group", err);
      alert("Error joining group");
    }
  };

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700">Available Groups</h2>
      <ul className="space-y-4">
        {groups.map((group) => (
          <li key={group._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="text-xl font-medium">{group.name}</h3>
              <p>{group.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewGroupDetails(group._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View Details
              </button>
              <button
                onClick={() => handleJoinGroup(group._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Join Group
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupsList;
