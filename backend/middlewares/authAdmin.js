import jwt from "jsonwebtoken";

// Middleware to authenticate admin using JWT
const authAdmin = async(req, res, next) => {
  const {token} = req.headers;
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
          return res.status(401).json({ error: "Invalid admin token." });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
};

export default authAdmin;