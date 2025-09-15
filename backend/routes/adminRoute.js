import express from "express";
import { addTherapist, adminLogin, appointmentsAdmin, getAllTherapists, dashboardData } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/therapistController.js";

const adminRouter = express.Router();

// Add logging middleware for debugging
adminRouter.use((req, res, next) => {
  next();
});

// Route to add a new therapist
adminRouter.post("/add-therapist", authAdmin, upload.single('image'), addTherapist);
adminRouter.get("/therapists", authAdmin, getAllTherapists);
adminRouter.post("/change-availability/:therapistId", (req, res) => {
  
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

adminRouter.get("/appointments", authAdmin, appointmentsAdmin); 
adminRouter.get("/dashboard-data", authAdmin, dashboardData);


export default adminRouter;