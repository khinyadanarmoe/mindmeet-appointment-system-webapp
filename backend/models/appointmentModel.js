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

// Add compound unique index to prevent duplicate bookings for the same therapist at the same time
// Only applies to non-cancelled appointments
appointmentSchema.index(
    { therapistId: 1, slotDate: 1, slotTime: 1 },
    { 
        unique: true,
        partialFilterExpression: { cancelled: { $ne: true } }
    }
);

// Also add index to prevent user from booking multiple appointments at the same time
appointmentSchema.index(
    { userId: 1, slotDate: 1, slotTime: 1 },
    { 
        unique: true,
        partialFilterExpression: { cancelled: { $ne: true } }
    }
);

const appointmentModel = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;