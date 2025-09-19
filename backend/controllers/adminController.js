import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import therapistModel from "../models/therapistModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
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
      available: available === 'true' || available === true || available === undefined ? true : false, // Default to true if not provided
      fees: Number(fees),
      address,
    };

    // Save to database
    const newTherapist = new therapistModel(therapistData);
    const savedTherapist = await newTherapist.save();

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
    res.status(200).json({ success: true, therapists });

  } catch (error) {
    console.error("Error fetching therapists:", error);
    res.status(500).json({ success: false, error: "Failed to fetch therapists", message: error.message });
  }
};


// getting all appointments
const appointmentsAdmin = async (req, res) => {
    try {
        console.log("Admin appointments endpoint called");
        
        // Import utility function to update appointment statuses
        const { updateAppointmentStatuses } = await import('../utils/appointmentUtils.js');
        
        // Auto-update completed appointments before returning results
        const updatedCount = await updateAppointmentStatuses(appointmentModel);
        if (updatedCount > 0) {
            console.log(`Auto-updated ${updatedCount} appointments to completed status`);
        }
        
        const appointments = await appointmentModel.find({}).sort({ createdAt: -1 });
        console.log("Found appointments:", appointments.length);
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.log("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Failed to fetch appointments" });
    }
};

// api to get dashboard data
const dashboardData = async (req, res) => {
  try {
    const therapistCount = await therapistModel.countDocuments();
    const userCount = await userModel.countDocuments();
    const appointmentCount = await appointmentModel.countDocuments();
    
    // Get latest 5 appointments without populate since data is embedded
    const latestAppointments = await appointmentModel.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({ 
      success: true,
      totalUsers: userCount,
      totalTherapists: therapistCount, 
      totalAppointments: appointmentCount,
      latestAppointments: latestAppointments
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch dashboard data", 
      message: error.message 
    });
  }
};

//delete therapist api
const deleteTherapist = async (req, res) => {
  try {
    const { therapistId } = req.params; 
    
    if (!therapistId) {
      return res.status(400).json({ 
        success: false, 
        message: "Therapist ID is required" 
      });
    }
    
    const therapist = await therapistModel.findById(therapistId);
    
    if (!therapist) {
      return res.status(404).json({ 
        success: false, 
        message: "Therapist not found" 
      });
    }
    
    await therapistModel.findByIdAndDelete(therapistId);
    
    res.status(200).json({ 
      success: true, 
      message: "Therapist deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting therapist:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete therapist" 
    });
  }
};

// API endpoint for admin to mark any appointment as completed
const markAppointmentCompleted = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    if (!appointmentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Appointment ID is required" 
      });
    }
    
    // Find the appointment
    const appointment = await appointmentModel.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }
    
    // Update the appointment to mark it as completed
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true },
      { new: true }
    );
    
    res.status(200).json({    
      success: true, 
      message: "Appointment marked as completed",
      appointment: updatedAppointment
    });
    
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark appointment as completed" 
    });
  }
};

export { addTherapist, adminLogin, getAllTherapists, appointmentsAdmin, dashboardData, deleteTherapist, markAppointmentCompleted };