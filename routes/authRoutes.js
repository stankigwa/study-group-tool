const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Helper to check if JWT_SECRET is set
const checkJWTSecret = () => {
    if (!process.env.JWT_SECRET) {
        console.warn("⚠️ JWT_SECRET is not defined in environment variables.");
        return false;
    }
    return true;
};

// Signup Route
router.post("/signup", async (req, res) => {
    if (!checkJWTSecret()) {
        return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET not set" });
    }

    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = new User({
            email: normalizedEmail,
            password: password,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "User created successfully!",
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    if (!checkJWTSecret()) {
        return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET not set" });
    }

    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
