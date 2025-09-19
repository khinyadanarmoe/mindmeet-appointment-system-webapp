// Scheduled tasks for the application
import appointmentModel from '../models/appointmentModel.js';
import { updateAppointmentStatuses } from '../utils/appointmentUtils.js';

// Run scheduled tasks
const runScheduledTasks = () => {
  // Check for appointments to mark as completed every 5 minutes
  setInterval(async () => {
    try {
      console.log('Running scheduled task: Updating appointment statuses');
      const count = await updateAppointmentStatuses(appointmentModel);
      if (count > 0) {
        console.log(`Scheduled task marked ${count} appointments as completed`);
      }
    } catch (error) {
      console.error('Error in scheduled appointment status update:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

export default runScheduledTasks;