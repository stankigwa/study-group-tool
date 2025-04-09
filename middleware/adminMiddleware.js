const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  // Extract user ID from the request (it should be available from the authentication middleware)
  const userId = req.user.id;

  try {
    // Find the user in the database using the userId from the token
    const user = await User.findById(userId);

    // Log the userId and the role for debugging purposes
    console.log("Decoded userId:", userId);
    console.log("User role:", user?.role);  // This will log the role of the user from the database

    // If the user is not found or is not an admin, deny access
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;
