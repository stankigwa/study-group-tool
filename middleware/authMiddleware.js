const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers (Bearer token)
  const token = req.headers["authorization"]?.split(" ")[1]; // Split to get the token part after "Bearer"

  if (!token) {
    // If no token is found in the request, return an error message
    return res.status(401).json({
      message: "Authorization token is missing. Please provide a valid token in the Authorization header."
    });
  }

  try {
    // Check if the JWT_SECRET environment variable is set
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server error: JWT secret is missing. Please check the environment variables."
      });
    }

    // Verify the token using the secret key from the environment variable
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the decoded user data to the request object
    req.user = decoded; 

    // Call the next middleware or route handler
    next(); 
  } catch (error) {
    console.error(error); // Log the error for debugging
    // If the token is invalid or expired, return an error message
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again."
    });
  }
};

module.exports = authMiddleware;
