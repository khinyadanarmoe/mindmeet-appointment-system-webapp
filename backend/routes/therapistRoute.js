import express from "express";
import therapistModel from "../models/therapistModel.js";
import { getTherapistAppointents, therapistList, therapistLogin, getTherapistProfile, updateTherapistProfile, markAppointmentCompleted } from "../controllers/therapistController.js";
import authTherapist from "../middlewares/authTherapist.js";
import upload from "../middlewares/multer.js";



const therapistRouter = express.Router();

// Route to get all therapists (public access)
therapistRouter.get("/list", therapistList);

// route to login therapist
therapistRouter.post("/login", therapistLogin);

therapistRouter.get('/appointments', authTherapist, getTherapistAppointents);

therapistRouter.get('/profile', authTherapist, getTherapistProfile);

therapistRouter.post('/update-profile', authTherapist, upload.single('image'), updateTherapistProfile);

// Route to mark appointment as completed
therapistRouter.post('/mark-completed', authTherapist, markAppointmentCompleted);

export default therapistRouter;
