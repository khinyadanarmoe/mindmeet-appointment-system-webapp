import express from "express";
import therapistModel from "../models/therapistModel.js";
import { therapistList } from "../controllers/therapistController.js";

const therapistRouter = express.Router();

// Route to get all therapists (public access)
therapistRouter.get("/list", therapistList);

export default therapistRouter;
