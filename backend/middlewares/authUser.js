import jwt from "jsonwebtoken";

// Middleware to authenticate user using JWT
const authUser = async(req, res, next) => {
  const {token} = req.headers;
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach to req object directly
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
};

export default authUser;