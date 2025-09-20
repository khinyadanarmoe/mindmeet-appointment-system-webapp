"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [aToken, setAToken] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  // Initialize token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("aToken");
      if (token) {
        setAToken(token);
      }
    }
  }, []);

  // Login function
  const loginAdmin = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/admin/login`, {
        email,
        password,
      });

      if (data.success) {
        setAToken(data.token);
        localStorage.setItem("aToken", data.token);
        toast.success("Login successful!");
        return true;
      } else {
        toast.error(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  // Logout function
  const logoutAdmin = () => {
    setAToken(null);
    localStorage.removeItem("aToken");
    toast.success("Logged out successfully");
  };

  // Get all therapists
  const getAllTherapists = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/therapists`, {
        headers: { token: aToken },
      });

      if (data.success) {
        setTherapists(data.therapists);
        return data.therapists;
      }
    } catch (error) {
      console.error("Error fetching therapists:", error);
      toast.error("Failed to fetch therapists");
    }
  };

  // Delete therapist account
  const deleteTherapistAccount = async (therapistId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/admin/delete-therapist/${therapistId}`,
        {
          headers: { token: aToken },
        }
      );

      if (data.success) {
        toast.success("Therapist deleted successfully");
        return true;
      } else {
        toast.error(data.message || "Failed to delete therapist account");
        return false;
      }
    } catch (error) {
      console.error("Error deleting therapist account:", error);
      toast.error("Failed to delete therapist account");
      return false;
    }
  };

  // Change therapist availability
  const changeAvailability = async (therapistId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/admin/change-availability`,
        { therapistId },
        {
          headers: { token: aToken },
        }
      );

      if (data.success) {
        toast.success("Availability updated successfully");
        return true;
      } else {
        toast.error(data.message || "Failed to update availability");
        return false;
      }
    } catch (error) {
      console.error("Error changing availability:", error);
      toast.error("Failed to update availability");
      return false;
    }
  };

  // Get dashboard data
  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/dashboard-data`, {
        headers: { token: aToken },
      });

      if (data.success) {
        setDashboardData(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
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

  // Get all appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/appointments`, {
        headers: { token: aToken },
      });

      if (data.success) {
        // Process appointments to mark completed if time has passed
        const processedAppointments = data.appointments.map((appointment) => {
          // If not cancelled and not completed, check if time has passed
          if (!appointment.cancelled && !appointment.isCompleted) {
            if (
              isAppointmentPassed(appointment.slotDate, appointment.slotTime)
            ) {
              // Mark as completed in UI
              appointment.isCompleted = true;

              // Update in backend (admin has access to update any appointment)
              axios
                .post(
                  `${backendUrl}/admin/mark-appointment-completed`,
                  { appointmentId: appointment._id },
                  { headers: { token: aToken } }
                )
                .catch((err) =>
                  console.error("Error marking appointment completed:", err)
                );
            }
          }
          return appointment;
        });

        setAppointments(processedAppointments);
        return processedAppointments;
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    therapists,
    appointments,
    dashboardData,
    loginAdmin,
    logoutAdmin,
    getAllTherapists,
    deleteTherapistAccount,
    changeAvailability,
    getDashboardData,
    getAllAppointments,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within AdminContextProvider");
  }
  return context;
};

export { AdminContext };
