import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 1. SIGNUP ROUTE
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "All fields are required" });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: "User already exists" });

        // Secure password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });
        res.status(201).json({ token, user: { id: newUser._id, email: newUser.email } });
    } catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
});

// 2. LOGIN ROUTE
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });
        res.status(200).json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;
