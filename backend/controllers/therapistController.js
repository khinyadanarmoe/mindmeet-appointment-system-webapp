import therapistModel from "../models/therapistModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// api for therapist login
const therapistLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if therapist exists
    const therapist = await therapistModel.findOne({ email });
    if (!therapist) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, therapist.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: therapist._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ 
      message: "Therapist login successful", 
      token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        speciality: therapist.speciality,
        available: therapist.available
      }
    });

  }
  catch (error) {
    console.error("Therapist login error:", error);
    res.status(500).json({ error: "Failed to login as therapist", message: error.message });
  }
};

// api to change therapist availability
const changeAvailability = async (req, res) => {
  try {
    const { therapistId } = req.body;
    const therapist = await therapistModel.findById(therapistId);
    
    if (!therapist) {
      return res.status(404).json({ 
        success: false, 
        message: "Therapist not found" 
      });
    }
    
    await therapistModel.findByIdAndUpdate(therapistId, { 
      available: !therapist.available 
    });
    
    res.status(200).json({ 
      success: true, 
      message: "Availability status changed successfully" 
    });

  } catch (error) {
    console.error("Error changing availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to change availability" 
    });
  }
};


const therapistList = async (req, res) => {
  try {
    const therapists = await therapistModel.find({ available: true }).select('-password -email -address');
    
    res.status(200).json({ 
      success: true, 
      therapists 
    });
  } catch (error) {
    console.error("Error fetching therapists:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch therapists" 
    });
  }
};

// get appointments for a therapist
const getTherapistAppointents = async (req, res) => {
  try {
    const therapistId = req.therapist.id; // Assuming the therapist ID is stored in req.therapist after authentication
    const appointments = await appointmentModel.find({ therapistId: therapistId }).populate('userId', '-password -email -address');
    
    res.status(200).json({ 
      success: true, 
      appointments 
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch appointments" 
    });
  }
};


// therapist profile api
const getTherapistProfile = async (req, res) => {
  try {
    const therapistId = req.therapist.id; // Assuming the therapist ID is stored in req.therapist after authentication
    const therapist = await therapistModel.findById(therapistId).select('-password -email -address');
    
    if (!therapist) {
      return res.status(404).json({ 
        success: false, 
        message: "Therapist not found" 
      });
    }
    
    res.status(200).json({    
      success: true, 
      therapist 
    });
  } catch (error) {
    console.error("Error fetching therapist profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch therapist profile" 
    });
  }
};



// therapist profile update api - Only allow updating specific fields
const updateTherapistProfile = async (req, res) => {
  try {
    const therapistId = req.therapist.id;
    const { about, zoomLink, available } = req.body;
    
    const updateData = {};
    
    // Only allow updating these specific fields
    if (about !== undefined) updateData.about = about;
    if (zoomLink !== undefined) updateData.zoomLink = zoomLink;
    if (available !== undefined) updateData.available = available === 'true' || available === true;
    
    // Handle image upload if provided
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary URL will be in file.path
    }
    
    const updatedTherapist = await therapistModel.findByIdAndUpdate(
      therapistId, 
      updateData, 
      { new: true }
    ).select('-password -email -address');
    
    if (!updatedTherapist) {
      return res.status(404).json({ 
        success: false, 
        message: "Therapist not found" 
      });
    }
    
    res.status(200).json({    
      success: true, 
      message: "Profile updated successfully",
      therapist: updatedTherapist
    });
  } catch (error) {
    console.error("Error updating therapist profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update therapist profile" 
    });
  }
};



export { changeAvailability, therapistList, therapistLogin, getTherapistAppointents, getTherapistProfile, updateTherapistProfile };