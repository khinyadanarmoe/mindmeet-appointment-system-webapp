import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// api to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if any property is missing
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists BEFORE creating new user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({ 
      success: true,
      message: "User registered successfully", 
      token 
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user", message: error.message });
  }
};

// api to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ 
      success: true,
      message: "Login successful", 
      token 
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to login", message: error.message });
  }
};


// api to get user info
const getUserInfo = async (req, res) => {
  try {
    const userId = req.userId; // Get from req.userId set by auth middleware

    // Fetch user details excluding password
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      success: true,
      user 
    });

  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Failed to fetch user info", message: error.message });
  }
};

export { registerUser, loginUser, getUserInfo };    
