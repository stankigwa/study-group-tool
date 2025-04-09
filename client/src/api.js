import axios from "axios";

// Set the base URL for the API
const API_URL = "http://localhost:5000/api/auth";

// Signup function to send user data to the backend
export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { email, password });
    return response.data; // returns the response from the backend
  } catch (error) {
    console.error("Error during signup:", error);
    throw error; // Re-throw to be caught by the caller
  }
};

// Login function to send login data to the backend
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // returns the response from the backend
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Re-throw to be caught by the caller
  }
};
