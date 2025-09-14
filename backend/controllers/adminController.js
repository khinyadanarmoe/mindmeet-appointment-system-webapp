import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import therapistModel from "../models/therapistModel.js";
import jwt from "jsonwebtoken";
import e from "express";

// Api for adding therapist
const addTherapist = async (req, res) => {
  try {
    const {name, email, password, zoomLink, speciality, degree, experience, about, available, fees, address} = req.body;
    const imageFile = req.file;
    
    // Validate required fields
    if (!name || !email || !password || !zoomLink || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ error: "All fields are required", message: "Missing details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Validate Zoom link
    if (!validator.isURL(zoomLink)) {
      return res.status(400).json({ error: "Invalid Zoom link" });
    }

    // Validate fees
    if (fees <= 0) {
      return res.status(400).json({ error: "Fees must be a positive number" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = null;
    
    // Handle image upload if file exists
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      imageUrl = imageUpload.secure_url;
    }

    // Create therapist data
    const therapistData = {
      name,
      email,
      password: hashedPassword,
      zoomLink,
      speciality,
      degree,
      experience,
      image: imageUrl,
      about,
      available: available === 'true' || available === true, // Handle string/boolean conversion
      fees: Number(fees),
      address,
    };

    // Save to database
    const newTherapist = new therapistModel(therapistData);
    const savedTherapist = await newTherapist.save();

    // Log only non-sensitive info
    console.log("Therapist saved successfully with ID:", savedTherapist._id);

    res.status(201).json({ 
      message: "Therapist added successfully",
      therapistId: savedTherapist._id,
      data: {
        name: savedTherapist.name,
        email: savedTherapist.email,
        speciality: savedTherapist.speciality
      }
    });

  } catch (error) {
    console.error("Error adding therapist:", error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: "Therapist with this email already exists" 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to add therapist", 
      message: error.message 
    });
  }
};

// api for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check against environment variables
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email+password, process.env.JWT_SECRET);
      
      return res.status(200).json({ message: "Admin login successful", token });
    } else {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Failed to login as admin", message: error.message });
  }
};

// api to get all therapists
const getAllTherapists = async (req, res) => {
  try {
    const therapists = await therapistModel.find({}).select('-password -email -address -zoomLink');
    res.status(200).json({ therapists });
  } catch (error) {
    console.error("Error fetching therapists:", error);
    res.status(500).json({ error: "Failed to fetch therapists", message: error.message });
  }
};

export { addTherapist, adminLogin, getAllTherapists };