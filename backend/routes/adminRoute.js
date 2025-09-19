import express from "express";
import { addTherapist, adminLogin, appointmentsAdmin, getAllTherapists, dashboardData, deleteTherapist, markAppointmentCompleted } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/therapistController.js";

const adminRouter = express.Router();

// Route for admin login
adminRouter.post("/login", adminLogin);

// Route to add a new therapist
adminRouter.post("/add-therapist", authAdmin, upload.single('image'), addTherapist);

// Route to get all therapists
adminRouter.get("/therapists", authAdmin, getAllTherapists);

// Route to change availability of a therapist
adminRouter.post("/change-availability", authAdmin, changeAvailability);

// Route to get all appointments
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);

// Route to get dashboard data
adminRouter.get("/dashboard-data", authAdmin, dashboardData);

// Route to delete a therapist
adminRouter.delete("/delete-therapist/:therapistId", authAdmin, deleteTherapist);

// Route to mark an appointment as completed
adminRouter.post("/mark-appointment-completed", authAdmin, markAppointmentCompleted);

export default adminRouter;