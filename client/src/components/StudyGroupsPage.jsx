import React, { useEffect, useState } from "react";
import axios from "axios";

const StudyGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/studygroups/available", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups(response.data.studyGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setMessage("Failed to load study groups.");
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `/api/studygroups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      // Refresh list
      fetchGroups();
    } catch (error) {
      console.error("Error joining group:", error);
      setMessage("Failed to join group.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Available Study Groups</h2>
      {loading ? (
        <p>Loading groups...</p>
      ) : (
        <>
          {message && <p>{message}</p>}
          {groups.length === 0 ? (
            <p>No available groups found.</p>
          ) : (
            <ul>
              {groups.map((group) => (
                <li key={group._id}>
                  <strong>{group.name}</strong> - {group.description}
                  <button onClick={() => joinGroup(group._id)} style={{ marginLeft: "1rem" }}>
                    Join
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default StudyGroupsPage;
