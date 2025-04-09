// client/src/pages/JoinGroup.js
import React, { useState } from 'react';
import axios from 'axios';

const JoinGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem("token");

  const handleSearch = async () => {
    try {
      setError('');
      setMessage('');
      const res = await axios.get(`http://localhost:5000/api/study-groups/search?name=${groupName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroup(res.data);
    } catch (err) {
      setGroup(null);
      setError('Group not found');
    }
  };

  const handleJoin = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/study-groups/${group._id}/join`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Successfully joined the group!');
    } catch (err) {
      setError('You may already be a member or there was an error.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Join a Study Group</h2>

      <input
        type="text"
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />
      <button
        onClick={handleSearch}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
      >
        Search
      </button>

      {group && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          <p className="text-sm text-gray-700">{group.description}</p>
          <button
            onClick={handleJoin}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Join Group
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default JoinGroup;
