import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import therapistModel from "../models/therapistModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

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

// api to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Get from auth middleware
    const { name, email, address, phone, dob, gender } = req.body;
    const image = req.file;

    // Validate required fields
    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ error: "Name, phone, date of birth, and gender are required" });
    }


    // Prepare update data
    const updateData = {
      name,
      phone,
      dob,
      gender
    };

    // Add optional fields if provided
    if (email) updateData.email = email;
    if (address) updateData.address = address;

    // Handle image upload
    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image"
        });
        updateData.image = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    // Update user profile
    const updatedUser = await userModel.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update profile", message: error.message });
  }
};


// api to book appointment with therapist
const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { therapistId, slotDate, slotTime } = req.body;

    // Validate required fields
    if (!therapistId || !slotDate || !slotTime) {
      return res.status(400).json({ error: "Therapist ID, slot date, and slot time are required" });
    }

    const userData = await userModel.findById(userId).select("-password");
    const therapist = await therapistModel.findById(therapistId);
    
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    
    if (!therapist.available) {
      return res.status(400).json({ error: "Therapist is not available for appointments" });
    }

    // Check if user already has an appointment with this therapist at the same date and time
    const existingAppointment = await appointmentModel.findOne({
      userId,
      therapistId,
      slotDate,
      slotTime,
      cancelled: { $ne: true } // Only check for non-cancelled appointments
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "You already have an appointment with this therapist at this time" });
    }

    // Check if user has any appointment at the same date and time (with any therapist)
    const conflictingAppointment = await appointmentModel.findOne({
      userId,
      slotDate,
      slotTime,
      cancelled: { $ne: true } // Only check for non-cancelled appointments
    });

    if (conflictingAppointment) {
      return res.status(400).json({ error: "You already have an appointment scheduled at this time" });
    }

    // Check if the therapist's time slot is already booked by another user
    let slots_booked = therapist.slots_booked || {};
    
    if (slots_booked[slotDate]) {
        if (slots_booked[slotDate].includes(slotTime)) {
            return res.status(400).json({ error: "This time slot is already booked" });
        } else {
            slots_booked[slotDate].push(slotTime);
        }
    } else {
        slots_booked[slotDate] = [slotTime];
    }

    // Create appointment data
    const appointmentData = {
        userId,
        therapistId,
        userData,
        therapistData: {
          _id: therapist._id,
          name: therapist.name,
          speciality: therapist.speciality,
          image: therapist.image,
          fees: therapist.fees,
          zoomLink: therapist.zoomLink
        },
        slotDate,
        slotTime,
        amount: therapist.fees,
    };

    // Save appointment first
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Then update therapist slots_booked
    therapist.slots_booked = slots_booked;
    await therapist.save();

    res.status(200).json({ 
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment
    });

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment", message: error.message });
  }
};

    // Further logic to book appointment can be added here

// api to get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.userId; // Get from auth middleware

    // Find all appointments for this user
    const appointments = await appointmentModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true,
      appointments
    });

  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments", message: error.message });
  }
};

export { registerUser, loginUser, getUserInfo, updateUserProfile, bookAppointment, getUserAppointments };    
