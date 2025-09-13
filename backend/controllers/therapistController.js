import therapistModel from "../models/therapistModel.js";


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
    const therapists = await therapistModel.find({ available: true }).select('-password -email  -address -zoomLink');
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

export { changeAvailability, therapistList };