import express from "express";
import { addTherapist, adminLogin, getAllTherapists } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/therapistController.js";

const adminRouter = express.Router();

// Add logging middleware for debugging
adminRouter.use((req, res, next) => {
  console.log(`Admin Route: ${req.method} ${req.path}`);
  next();
});

// Route to add a new therapist
adminRouter.post("/add-therapist", authAdmin, upload.single('image'), addTherapist);

// Route to get all therapists
adminRouter.get("/therapists", authAdmin, getAllTherapists);

// Route to change availability of a therapist (URL params version for testing)
adminRouter.post("/change-availability/:therapistId", (req, res) => {
  console.log("Change availability route hit with URL params!");
  console.log("Therapist ID from params:", req.params.therapistId);
  
  const therapistId = req.params.therapistId;
  
  if (!therapistId) {
    return res.status(400).json({ 
      success: false, 
      message: "Therapist ID is required in URL" 
    });
  }
  
  // Call the changeAvailability function with a mock request
  const mockReq = {
    body: { therapistId: therapistId }
  };
  
  changeAvailability(mockReq, res);
});

// Route to change availability of a therapist (original JSON version)
adminRouter.post("/change-availability", (req, res, next) => {
  console.log("Change availability route hit!");
  console.log("Request body:", req.body);
  console.log("Raw body:", req.rawBody);
  console.log("Headers:", req.headers);
  console.log("Content-Type:", req.get('Content-Type'));
  
  // Try to handle the request even if body is undefined
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: "Request body is missing or empty. Make sure to send JSON with Content-Type: application/json. Or try using the URL params version: POST /change-availability/THERAPIST_ID" 
    });
  }
  
  changeAvailability(req, res);
});

// Route for admin login
adminRouter.post("/login", adminLogin);



export default adminRouter;