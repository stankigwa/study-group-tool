const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ===== SIGN UP =====
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("Sign-up attempt:", email, password);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Use bcryptjs to hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();
    console.log("User created:", user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        role: user.role,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Use bcryptjs to compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful:", user.email);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET CURRENT USER PROFILE WITH STUDY GROUPS =====
router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("studyGroups");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data fetched successfully",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name || "",
        studyGroups: user.studyGroups,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== UPDATE PROFILE =====
router.put("/profile", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { email, password, name } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (name) user.name = name;

    if (password) {
      // Hash new password with bcryptjs before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== UPDATE USER ROLE (ADMIN ONLY) =====
router.put("/:userId/role", authMiddleware, adminMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    res.status(200).json({
      message: `User's role updated to ${role}`,
      user: {
        email: userToUpdate.email,
        role: userToUpdate.role,
      },
    });
  } catch (error) {
    console.error("Error during role update:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
