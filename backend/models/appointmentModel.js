import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({ 
    userId: { type: String, required: true },
    therapistId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    therapistData: { type: Object, required: true },
    amount: { type: Number, required: true },  
    cancelled: { type: Boolean, default: false }, 
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const appointmentModel = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;