import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GroupManagement = () => {
  const { groupId } = useParams(); // Get groupId from the URL parameter
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const [newAdmin, setNewAdmin] = useState(""); // For selecting a user to promote

  useEffect(() => {
    // Fetch group details to display members and other info
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`/api/study-groups/${groupId}`);
        setGroup(response.data);
      } catch (err) {
        setError("Failed to fetch group details.");
      }
    };
    fetchGroupDetails();
  }, [groupId]);

  // Promote user to admin
  const promoteUserToAdmin = async (userId) => {
    try {
      const response = await axios.post(`/api/study-groups/${groupId}/promote`, {
        userId: userId,
      });
      setGroup(response.data); // Update the group data with the updated list of admins
    } catch (err) {
      setError("Failed to promote user.");
      console.error(err.response?.data || err.message); // Log the error for debugging
    }
  };

  // Remove user from group (this should be a DELETE request in the backend)
  const removeUserFromGroup = async (userId) => {
    try {
      const response = await axios.delete(`/api/study-groups/${groupId}/members/${userId}`);
      setGroup(response.data); // Update the group data with the updated members list
    } catch (err) {
      setError("Failed to remove user.");
      console.error(err.response?.data || err.message); // Log the error for debugging
    }
  };

  // Handle new admin selection change
  const handleNewAdminChange = (e) => {
    setNewAdmin(e.target.value);
  };

  if (!group) {
    return <p>Loading group details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manage Group: {group.name}</h2>
      <p>{group.description}</p>

      <h3>Members</h3>
      <ul>
        {group.members.map((member) => (
          <li key={member._id}>
            {member.name}{" "}
            {group.admins.includes(member._id) ? (
              <span>(Admin)</span>
            ) : (
              <button onClick={() => promoteUserToAdmin(member._id)}>
                Promote to Admin
              </button>
            )}
            <button onClick={() => removeUserFromGroup(member._id)}>
              Remove from Group
            </button>
          </li>
        ))}
      </ul>

      <h3>Promote User to Admin</h3>
      <select
        value={newAdmin}
        onChange={handleNewAdminChange}
        style={{ marginRight: "1rem" }}
      >
        <option value="">Select a user to promote</option>
        {group.members
          .filter((member) => !group.admins.includes(member._id))
          .map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
      </select>
      <button onClick={() => promoteUserToAdmin(newAdmin)}>Promote</button>
    </div>
  );
};

export default GroupManagement;
