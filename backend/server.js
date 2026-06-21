import express from "express";
import 'dotenv/config';
import cors from "cors";
import mongoose from "mongoose";
import ChatRoutes from "./routes/chat.js";
import AuthRoutes from "./routes/auth.js"; // <-- 1. Import Auth Routes

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", ChatRoutes);
app.use("/api/auth", AuthRoutes); // <-- 2. Register Auth Routes (/api/auth/signup & /api/auth/login)

// Keep your DB connection helper organized above invocation
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            tls: true,
            tlsAllowInvalidCertificates: true,
            autoSelectFamily: false 
        });
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("failed to connect", err);
    }
};

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    ConnectDB();
});



/*
app.post("/test", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` 
        },
        body: JSON.stringify({
            model: "gemini-2.5-flash", 
            messages: [
                {
                    role: "user",
                    content: req.body.message || "Hello!" 
                }
            ]
        })
    };
    
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", options);
        const data = await response.json();
        
        console.log(data);
        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "Invalid response schema returned from Gemini" });
        }
        
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
*/
