// Utility functions for appointments

// Check if an appointment has passed based on date and time
export const isAppointmentPassed = (slotDate, slotTime) => {
  if (!slotDate || !slotTime) return false;
  
  // Convert time to 24-hour format if needed
  const time24 = convertTo24Hour(slotTime);
  
  // Parse the date and time to create a datetime object
  const [year, month, day] = slotDate.split('-').map(Number);
  const [hours, minutes] = time24.split(':').map(Number);
  
  // Create appointment date object (months are 0-indexed in JavaScript Date)
  const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
  // Add 1 hour to appointment time (assuming sessions are 1 hour)
  const appointmentEndTime = new Date(appointmentDateTime.getTime() + (60 * 60 * 1000));
  
  // Compare with current date/time
  const now = new Date();
  
  return now > appointmentEndTime;
};

// Convert time from 12-hour format to 24-hour format
export const convertTo24Hour = (time) => {
  if (!time) return '';
  
  // If already in 24-hour format (contains no AM/PM), return as is
  if (!time.toLowerCase().includes('am') && !time.toLowerCase().includes('pm')) {
    return time;
  }
  
  const isPM = time.toLowerCase().includes('pm');
  const timeOnly = time.toLowerCase().replace('am', '').replace('pm', '').trim();
  const [hours, minutes] = timeOnly.split(':').map(Number);
  
  let hours24 = hours;
  if (isPM && hours !== 12) {
    hours24 = hours + 12;
  } else if (!isPM && hours === 12) {
    hours24 = 0;
  }
  
  return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Auto-update appointment statuses based on current time
export const updateAppointmentStatuses = async (appointmentModel) => {
  try {
    // Get all non-canceled, non-completed appointments
    const pendingAppointments = await appointmentModel.find({
      cancelled: false,
      isCompleted: false
    });
    
    let updatedCount = 0;
    
    for (const appointment of pendingAppointments) {
      if (isAppointmentPassed(appointment.slotDate, appointment.slotTime)) {
        // Mark the appointment as completed
        await appointmentModel.findByIdAndUpdate(appointment._id, {
          isCompleted: true
        });
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      console.log(`Auto-updated ${updatedCount} appointments to completed status`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error updating appointment statuses:', error);
    return 0;
  }
};