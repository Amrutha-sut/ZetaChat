import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { verifyToken } from "../utils/authMiddleware.js"; // 1. Imported your security middleware

const router = express.Router();

// Test Route (Protected)
router.post("/test", verifyToken, async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abcdef",
            title: "Testing New Thread-5",
            userId: req.user.id // Link to authenticated user
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

// Get all threads for the logged-in user
router.get("/thread", verifyToken, async (req, res) => {
    try {
        // 2. Filtered database search to only return threads matching the user's ID
        const threads = await Thread.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// Get messages for a specific thread belonging to the user
router.get("/thread/:threadId", verifyToken, async (req, res) => {
    const { threadId } = req.params;

    try {
        // 3. Ensured a user cannot read someone else's thread by matching userId
        const thread = await Thread.findOne({ threadId, userId: req.user.id });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found or unauthorized" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// Delete a user's thread
router.delete("/thread/:threadId", verifyToken, async (req, res) => {
    const { threadId } = req.params;

    try {
        // 4. Ensured a user can only delete their own threads
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user.id });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found or unauthorized" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Core Chat Endpoint (Protected)
router.post("/chat", verifyToken, async (req, res) => {
    let { threadId, message } = req.body;

    if (message && typeof message === 'object') {
        message = message.text || message.content || message.message || "";
    }

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        // Find thread belonging strictly to the authenticated user
        let thread = await Thread.findOne({ threadId, userId: req.user.id });

        if (!thread) {
            // 5. Create a new thread and explicitly tie it to req.user.id
            thread = new Thread({
                threadId,
                userId: req.user.id, 
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // Fetch OpenAI Reply
        const assistantReply = await getOpenAIAPIResponse(message);
        
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.log("Database or API error: ", err);
        res.status(500).json({ error: "something went wrong" });
    }
});

export default router;
