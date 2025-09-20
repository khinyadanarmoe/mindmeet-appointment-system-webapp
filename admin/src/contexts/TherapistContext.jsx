"use client";

import React, { use, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const TherapistContext = createContext();

const TherapistContextProvider = (props) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dToken, setDToken] = React.useState(null);
  const [appointments, setAppointments] = React.useState([]);
  const [therapistProfile, setTherapistProfile] = React.useState(null);
  const [dashboardData, setDashboardData] = React.useState(null);

  useEffect(() => {
    // Get token from localStorage on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("dToken");
      setDToken(token);
    }
  }, []);

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
      getTherapistProfile();
      getDashboardData();
    }
  }, [dToken]);

  // function to get therapist info
  const getTherapistProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/therapist/profile`, {
        headers: { token: dToken },
      });

      if (data.success) {
        console.log("API Response - Therapist Data:", data.therapist);

        let email = data.therapist.email;

        console.log("Processed email:", email);
        console.log("Type of email:", typeof email);

        const therapistWithEmail = {
          ...data.therapist,
          email: email,
        };

        setTherapistProfile(therapistWithEmail);
        return therapistWithEmail;
      } else {
        toast.error(data.message || "Failed to fetch therapist profile");
        return null;
      }
    } catch (error) {
      console.error("Error fetching therapist profile:", error);
      toast.error("Failed to fetch therapist profile");
      throw error;
    }
  };

  // Helper function to check if an appointment time has passed
  const isAppointmentPassed = (slotDate, slotTime) => {
    if (!slotDate || !slotTime) return false;

    // Convert appointment date and time to a Date object
    const [year, month, day] = slotDate.split("-").map(Number);

    // Handle both 12-hour and 24-hour time formats
    let hours = 0;
    let minutes = 0;

    if (slotTime.includes(":")) {
      let timeParts = slotTime.split(":");
      hours = parseInt(timeParts[0]);
      minutes = parseInt(timeParts[1]);

      // Handle AM/PM format
      if (slotTime.toLowerCase().includes("pm") && hours < 12) {
        hours += 12;
      } else if (slotTime.toLowerCase().includes("am") && hours === 12) {
        hours = 0;
      }
    }

    // Create appointment date object (months are 0-indexed in JavaScript Date)
    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
    // Add 1 hour to appointment time (assuming sessions are 1 hour)
    const appointmentEndTime = new Date(
      appointmentDateTime.getTime() + 60 * 60 * 1000
    );

    // Compare with current date/time
    const now = new Date();

    return now > appointmentEndTime;
  };

  // Function to get all appointments and store in state
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/therapist/appointments`, {
        headers: { token: dToken },
      });

      if (data.success) {
        // Check for appointments that should be marked as completed
        const updatedAppointments = data.appointments.map((appointment) => {
          // If not cancelled and not completed, check if time has passed
          if (!appointment.cancelled && !appointment.isCompleted) {
            if (
              isAppointmentPassed(appointment.slotDate, appointment.slotTime)
            ) {
              // Mark as completed locally
              appointment.isCompleted = true;

              // Update in backend
              axios
                .post(
                  `${backendUrl}/therapist/mark-completed`,
                  { appointmentId: appointment._id },
                  { headers: { token: dToken } }
                )
                .catch((err) =>
                  console.error("Error marking appointment completed:", err)
                );
            }
          }
          return appointment;
        });

        setAppointments(updatedAppointments);
        return updatedAppointments;
      } else {
        toast.error(data.message || "Failed to fetch appointments");
        return [];
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
      throw error;
    }
  };

  // Function to update therapist profile
  const updateTherapistProfile = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/therapist/update-profile`,
        formData,
        {
          headers: {
            token: dToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setTherapistProfile(data.therapist);
        return true;
      } else {
        toast.error(data.message || "Failed to update profile");
        return false;
      }
    } catch (error) {
      console.error("Error updating therapist profile:", error);

      // More detailed error message
      let errorMessage = "Failed to update profile";
      if (error.response) {
        console.error("Error response data:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      }

      toast.error(errorMessage);
      return false;
    }
  };

  // therapist dashboard -> number of appointments, upcoming appointments, completed appointments, canceled appointments
  // how much earning in total
  // recent added appointments (last 5)

  const getDashboardData = () => {
    if (!therapistProfile || !appointments) return null;

    const totalAppointments = appointments.length;
    const upcomingAppointments = appointments.filter(
      (appt) => new Date(appt.date) >= new Date() && appt.status === "scheduled"
    ).length;
    const completedAppointments = appointments.filter(
      (appt) => appt.status === "completed"
    ).length;
    const canceledAppointments = appointments.filter(
      (appt) => appt.status === "canceled"
    ).length;
    const totalEarnings = appointments.reduce(
      (sum, appt) => sum + (appt.fee || 0),
      0
    );
    const recentAppointments = [...appointments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setDashboardData({
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      canceledAppointments,
      totalEarnings,
      recentAppointments,
    });

    return {
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      canceledAppointments,
      totalEarnings,
      recentAppointments,
    };
  };

  // Context value to be provided to consuming components

  const value = {
    backendUrl,
    dToken,
    setDToken,
    appointments,
    getAllAppointments,
    getTherapistProfile,
    updateTherapistProfile,
    therapistProfile,
    setTherapistProfile,
    dashboardData,
    getDashboardData,
    setDashboardData,
  };

  return (
    <TherapistContext.Provider value={value}>
      {props.children}
    </TherapistContext.Provider>
  );
};

export default TherapistContextProvider;
