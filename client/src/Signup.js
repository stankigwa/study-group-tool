import React, { useState } from "react";
import { signup } from "./api"; // Import the signup API function

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For displaying success or error messages

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    try {
      const data = await signup(email, password);
      setMessage(data.message); // Display success message from backend
    } catch (error) {
      setMessage("Signup failed! Please try again.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>} {/* Display success or error messages */}
    </div>
  );
}

export default Signup;
