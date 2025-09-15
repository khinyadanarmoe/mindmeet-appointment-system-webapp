import jwt from "jsonwebtoken";

// Middleware to authenticate therapist
const authTherapist = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized. Login again" 
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.therapist = { id: token_decode.id };
    next();

  } catch (error) {
    console.error("Therapist auth error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Invalid token. Login again" 
    });
  }
};

export default authTherapist;
