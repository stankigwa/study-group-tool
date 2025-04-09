import React, { useEffect, useState } from "react";
import axios from "axios";

const AvailableGroups = () => {
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/study-groups/available", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data.studyGroups); // Expecting the backend to return { studyGroups: [...] }
      } catch (error) {
        console.error("Error fetching study groups", error);
      }
    };

    fetchGroups();
  }, [token]);

  const handleJoin = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/study-groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("You joined the group!");
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Could not join group.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Available Study Groups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">No available study groups at the moment.</p>
        ) : (
          groups.map((group) => (
            <div key={group._id} className="bg-white shadow-lg rounded-xl p-5 border border-blue-200">
              <h2 className="text-xl font-semibold text-purple-700">{group.name}</h2>
              <p className="text-gray-600 mt-2">{group.description}</p>
              <button
                onClick={() => handleJoin(group._id)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition"
              >
                Join Group
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableGroups;
