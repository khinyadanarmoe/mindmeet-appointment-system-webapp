// Middleware to auto-update appointment status when fetching appointments
import { updateAppointmentStatuses } from '../utils/appointmentUtils.js';
import appointmentModel from '../models/appointmentModel.js';

const autoUpdateAppointmentStatus = async (req, res, next) => {
  try {
    // Only run this middleware for routes that fetch appointments
    const appointmentRoutes = [
      '/api/user/my-appointments',
      '/api/therapist/appointments',
      '/api/admin/appointments'
    ];
    
    if (appointmentRoutes.includes(req.path)) {
      // Update appointment statuses
      await updateAppointmentStatuses(appointmentModel);
    }
    
    next();
  } catch (error) {
    console.error('Error in autoUpdateAppointmentStatus middleware:', error);
    // Continue to next middleware even if there's an error
    next();
  }
};

export default autoUpdateAppointmentStatus;