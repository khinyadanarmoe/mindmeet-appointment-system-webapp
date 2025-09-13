import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  zoomLink: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  image: { type: String }, 
  about: { type: String },
  available: { type: Boolean, required: true   },  
  fees: { type: Number, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  slots_booked: { type: Object, default: {} },
}, {minimize: false });

const therapistModel = mongoose.models.Therapist || mongoose.model("Therapist", therapistSchema);

export default therapistModel;