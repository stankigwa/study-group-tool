import React, { useState, useEffect } from "react";
import axios from "axios";

function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available study groups that the logged-in user is not already part of
    axios
      .get("http://localhost:5000/api/study-groups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setStudyGroups(response.data); // Set study groups data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching study groups:", error);
        setLoading(false); // Stop loading in case of error
      });
  }, []);

  const joinGroup = (groupId) => {
    axios
      .post(
        `http://localhost:5000/api/study-groups/${groupId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        console.log("Joined the group:", response.data);
        // Optionally update the UI to reflect the change or notify the user
        alert("You have successfully joined the group!");
      })
      .catch((error) => {
        console.error("Error joining group:", error);
        alert("There was an error joining the group. Please try again.");
      });
  };

  if (loading) {
    return <p>Loading study groups...</p>;
  }

  return (
    <div>
      <h1>Available Study Groups</h1>
      {studyGroups.length === 0 ? (
        <p>No study groups available to join.</p>
      ) : (
        <ul>
          {studyGroups.map((group) => (
            <li key={group._id}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <button onClick={() => joinGroup(group._id)}>Join Group</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudyGroupsPage;
