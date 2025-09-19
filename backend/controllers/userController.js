import validator from "validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import therapistModel from "../models/therapistModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Helper function to convert time to 24-hour format
const convertTo24Hour = (timeStr) => {
  // If it's already in 24-hour format (HH:MM), return as is
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    return timeStr.length === 4 ? '0' + timeStr : timeStr; // Add leading zero if needed
  }
  
  // If it's in 12-hour format (HH:MM AM/PM), convert it
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(timeStr)) {
    const [time, modifier] = timeStr.split(/\s+/);
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier.toUpperCase() === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  return timeStr; // Return as is if format is not recognized
};

// Utility function to sync existing appointments with therapist slots_booked
const syncTherapistSlotsBooked = async () => {
  try {
    // Get all active appointments
    const appointments = await appointmentModel.find({ cancelled: { $ne: true } });
    
    // Group appointments by therapist
    const therapistSlots = {};
    
    appointments.forEach(apt => {
      if (!therapistSlots[apt.therapistId]) {
        therapistSlots[apt.therapistId] = {};
      }
      
      if (!therapistSlots[apt.therapistId][apt.slotDate]) {
        therapistSlots[apt.therapistId][apt.slotDate] = [];
      }
      
      // Normalize time format to 24-hour and remove duplicates
      const normalizedTime = convertTo24Hour(apt.slotTime);
      if (!therapistSlots[apt.therapistId][apt.slotDate].includes(normalizedTime)) {
        therapistSlots[apt.therapistId][apt.slotDate].push(normalizedTime);
      }
    });
    
    // Update each therapist's slots_booked
    for (const [therapistId, slots] of Object.entries(therapistSlots)) {
      await therapistModel.findByIdAndUpdate(
        therapistId,
        { slots_booked: slots },
        { new: true }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing therapist slots:', error);
    return false;
  }
};

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
    let { therapistId, slotDate, slotTime } = req.body;

    // Validate required fields
    if (!therapistId || !slotDate || !slotTime) {
      return res.status(400).json({ error: "Therapist ID, slot date, and slot time are required" });
    }

    // Normalize time format to 24-hour format for consistency
    slotTime = convertTo24Hour(slotTime);

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
    // Use atomic operation to prevent race conditions
    const existingSlotBooking = await appointmentModel.findOne({
      therapistId,
      slotDate,
      slotTime,
      cancelled: { $ne: true } // Only check non-cancelled appointments
    });

    if (existingSlotBooking) {
      return res.status(400).json({ error: "This time slot is already booked by another patient" });
    }

    // Create appointment data first
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

    // Use atomic operation to save appointment and update therapist slots
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Save appointment first
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save({ session });

        // Update therapist slots_booked atomically
        let slots_booked = therapist.slots_booked || {};
        
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                throw new Error("Time slot was just booked by another user");
            }
            slots_booked[slotDate].push(slotTime);
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        // Update therapist with new slots
        await therapistModel.findByIdAndUpdate(
          therapistId,
          { slots_booked: slots_booked },
          { session, new: true }
        );

        return newAppointment;
      });

      res.status(200).json({ 
        success: true,
        message: "Appointment booked successfully"
      });

    } catch (transactionError) {
      if (transactionError.message.includes("Time slot was just booked")) {
        return res.status(400).json({ error: "This time slot was just booked by another user. Please select a different time." });
      }
      throw transactionError;
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error("Error booking appointment:", error);
    
    // Handle duplicate key error (E11000) from MongoDB unique constraint
    if (error.code === 11000) {
      if (error.message.includes('therapistId_1_slotDate_1_slotTime_1')) {
        return res.status(400).json({ error: "This time slot is already booked by another patient" });
      } else if (error.message.includes('userId_1_slotDate_1_slotTime_1')) {
        return res.status(400).json({ error: "You already have an appointment scheduled at this time" });
      }
      return res.status(400).json({ error: "This appointment slot is no longer available" });
    }
    
    res.status(500).json({ error: "Failed to book appointment", message: error.message });
  }
};

// api to get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.userId; // Get from auth middleware
    
    // Import utility function to update appointment statuses
    const { updateAppointmentStatuses } = await import('../utils/appointmentUtils.js');
    
    // Auto-update completed appointments before returning results
    await updateAppointmentStatuses(appointmentModel);
    
    // Find all non-cancelled appointments for this user
    const appointments = await appointmentModel.find({ 
      userId, 
      cancelled: { $ne: true } 
    }).sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true,
      appointments
    });

  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments", message: error.message });
  }
};

// Admin utility API to sync therapist slots_booked with existing appointments
const syncSlotsBooked = async (req, res) => {
  try {
    const success = await syncTherapistSlotsBooked();
    
    if (success) {
      res.status(200).json({ 
        success: true,
        message: "Therapist slots synchronized successfully"
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "Failed to sync therapist slots"
      });
    }
  } catch (error) {
    console.error("Error in sync endpoint:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to sync therapist slots",
      error: error.message
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    // Validate required fields
    if (!appointmentId) {
      return res.status(400).json({ error: "Appointment ID is required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to cancel this appointment" });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ error: "Appointment is already cancelled" });
    }

    // Mark appointment as cancelled
    appointment.cancelled = true;
    await appointment.save();

    // Update therapist's slots_booked to remove this slot
    const therapist = await therapistModel.findById(appointment.therapistId);
    if (therapist && therapist.slots_booked && therapist.slots_booked[appointment.slotDate]) {
      // Normalize the appointment time to 24-hour format for consistent comparison
      const normalizedAppointmentTime = convertTo24Hour(appointment.slotTime);
      
      // Filter out the cancelled slot (checking both original and normalized formats)
      therapist.slots_booked[appointment.slotDate] = therapist.slots_booked[appointment.slotDate].filter(time => {
        const normalizedSlotTime = convertTo24Hour(time);
        return normalizedSlotTime !== normalizedAppointmentTime && time !== appointment.slotTime;
      });
      
      // If no more slots on that date, remove the date entry
      if (therapist.slots_booked[appointment.slotDate].length === 0) {
        delete therapist.slots_booked[appointment.slotDate];
      }
      
      // Mark the therapist document as modified to ensure the update is saved
      therapist.markModified('slots_booked');
      await therapist.save();
    }

    res.status(200).json({ 
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ error: "Failed to cancel appointment", message: error.message });
  }
};

// GET /api/therapists?speciality=SpecialityName
const getTherapists = async (req, res) => {
  try {
    const { speciality } = req.query;
    let filter = {};
    if (speciality) {
      filter.speciality = speciality;
    }
    const therapists = await therapistModel.find(filter).select('-password -email -address -zoomLink');
    res.status(200).json({ success: true, therapists });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch therapists", message: error.message });
  }
};

// Mark appointment as completed for user
const markAppointmentCompleted = async (req, res) => {
  try {
    const userId = req.userId; // User ID from auth middleware
    const { appointmentId } = req.body;
    
    if (!appointmentId) {
      return res.status(400).json({ error: "Appointment ID is required" });
    }
    
    // Ensure the appointment belongs to the user
    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      userId: userId
    });
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found or not associated with your account" });
    }
    
    // Update the appointment status
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
    
    res.status(200).json({ 
      success: true,
      message: "Appointment marked as completed"
    });
    
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    res.status(500).json({ error: "Failed to mark appointment as completed", message: error.message });
  }
};


export { registerUser, loginUser, getUserInfo, updateUserProfile, bookAppointment, getUserAppointments, syncSlotsBooked, cancelAppointment, getTherapists, markAppointmentCompleted };
