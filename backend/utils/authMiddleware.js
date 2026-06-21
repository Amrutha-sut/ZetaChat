import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // 1. Get token from authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. Please log in first." });
    }

    // Split "Bearer <token>" to extract just the token string
    const token = authHeader.split(" ")[1];

    try {
        // 2. Verify the token signature using your .env JWT_SECRET key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        
        // 3. Attach decoded payload (user ID) to request object so your controllers can read it
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired session token." });
    }
};
