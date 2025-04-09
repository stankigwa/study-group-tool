import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function GroupDetails() {
  const { id } = useParams(); // group ID from URL
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Define fetchData with useCallback to avoid unnecessary re-creations
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Use Promise.all to fetch both group and user data concurrently
      const [groupRes, userRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/groups`),
        axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const matchedGroup = groupRes.data.find((g) => g._id === id);
      setGroup(matchedGroup);
      setCurrentUser(userRes.data.user);
      setFormData({
        name: matchedGroup.name,
        description: matchedGroup.description,
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("An error occurred while fetching data.");
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData(); // Call fetchData after it's defined
  }, [fetchData]);

  if (loading) return <p className="p-4">Loading group details...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  const isAdmin = group?.admins?.includes(currentUser?._id);

  const handleEdit = () => setEditMode(true);

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/groups/${id}/manage`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Group updated successfully!");
      setEditMode(false);
      fetchData(); // re-fetch group data to update the UI
    } catch (error) {
      console.error("Failed to update group", error);
      alert("Failed to update group");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/groups/${id}/manage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Group deleted!");
      navigate("/my-groups");
    } catch (error) {
      console.error("Failed to delete group", error);
      alert("Failed to delete group");
    }
  };

  const handleLeaveGroup = async () => {
    const confirmLeave = window.confirm("Are you sure you want to leave this group?");
    if (!confirmLeave) return;

    try {
      await axios.post(
        `http://localhost:5000/api/groups/${id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("You have left the group.");
      navigate("/my-groups");
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Error leaving group");
    }
  };

  const handleRemove = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/groups/${id}/remove`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User removed from group.");
      fetchData(); // re-fetch group data to update the UI
    } catch (error) {
      console.error("Failed to remove member", error);
      alert("Failed to remove member");
    }
  };

  const handlePromote = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/groups/${id}/promote`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User promoted to admin!");
      fetchData(); // refresh group data
    } catch (error) {
      console.error("Promotion failed", error);
      alert("Promotion failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700">Group Details</h2>

      {editMode ? (
        <div className="mb-6 space-y-3">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Group Name"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Description"
          />
          <div className="space-x-3">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-2"><strong>Name:</strong> {group.name}</p>
          <p className="mb-4"><strong>Description:</strong> {group.description}</p>
        </>
      )}

      {isAdmin && !editMode && (
        <div className="mb-6 space-x-3">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          >
            Edit Group
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition duration-300"
          >
            Delete Group
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Members</h3>
        <ul className="space-y-2">
          {group.members.map((member) => (
            <li
              key={member._id}
              className="border p-4 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>

                <div className="flex gap-2">
                  {group.admins.includes(member._id) && (
                    <span className="text-blue-500 text-sm font-semibold">(Admin)</span>
                  )}
                  {isAdmin && member._id !== currentUser._id && (
                    <>
                      {!group.admins.includes(member._id) && (
                        <button
                          onClick={() => handlePromote(member._id)}
                          className="bg-yellow-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 transition duration-300"
                        >
                          Promote
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(member._id)}
                        className="bg-red-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition duration-300"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleLeaveGroup}
          className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 focus:ring-2 focus:ring-red-500 transition duration-300"
        >
          Leave Group
        </button>
      </div>
    </div>
  );
}

export default GroupDetails;
