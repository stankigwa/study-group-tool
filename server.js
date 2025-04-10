// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const protectedRoutes = require("./routes/protectedRoutes"); // Import protected routes
const studyGroupRoutes = require("./routes/studyGroupRoutes"); // Import study group routes
const userRoutes = require("./routes/userRoutes"); // Import user routes

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// CORS setup for frontend at http://localhost:3000 (adjust as necessary)
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL, make sure it's correct
  methods: "GET, POST, PUT, DELETE", // Allowed methods
  allowedHeaders: "Content-Type, Authorization", // Allowed headers
};

app.use(cors(corsOptions)); // Use CORS with options

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Database Connection Error:", err));

// Default Route (For Testing)
app.get("/", (req, res) => {
  res.send("Welcome to the Online Study Group Coordination Tool API!");
});

// Use Routes
app.use("/api/auth", authRoutes); // Handles /api/auth/signup and /api/auth/login routes
app.use("/api/protected", protectedRoutes); // Handles /api/protected/profile
app.use("/api/studyGroups", studyGroupRoutes); // Handles study group routes like /api/studyGroups/create, join, leave, etc.
app.use("/api/users", userRoutes); // Handles /api/users/profile and other user-related routes

// Global Error Handler (for unhandled errors)
app.use((err, req, res, next) => {
  console.error("Error: ", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
