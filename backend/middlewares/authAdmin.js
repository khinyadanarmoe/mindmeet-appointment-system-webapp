import jwt from "jsonwebtoken";

// Middleware to authenticate admin using JWT
const authAdmin = async(req, res, next) => {
  const {token} = req.headers;
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        // For admin tokens, we just need to verify the signature is valid
        // The token itself is signed with the admin email+password as payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Admin token verified successfully");
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("JWT verify error:", error);
        res.status(400).json({ error: "Invalid token." });
    }
};

export default authAdmin;