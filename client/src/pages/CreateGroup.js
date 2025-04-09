import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const [group, setGroup] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGroup({
      ...group,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/groups",
        group,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Group created successfully!");
      setError(null);
      navigate("/my-groups"); // Redirect to the user's groups
    } catch (err) {
      console.error("Error creating group", err);
      setError("Error creating group");
      setSuccess(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700">Create New Group</h2>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">Group Name</label>
          <input
            type="text"
            name="name"
            value={group.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Description</label>
          <textarea
            name="description"
            value={group.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Group
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
