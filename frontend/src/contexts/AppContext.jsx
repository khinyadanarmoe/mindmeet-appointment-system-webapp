"use client";

import React from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "฿";
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";

  const [therapists, setTherapists] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);

  // Initialize token from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token") || "";
      setToken(storedToken);
    }
  }, []);

  // function to fetch user data from backend API
  const getUserData = async () => {
    if (!token) {
      setUserData(null);
      return;
    }
    try {
      const userInfoUrl = `${backendUrl}/api/user/get-user-info`;

      const response = await axios.get(userInfoUrl, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      const { data } = response;

      if (data.success && data.user) {
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch user data");
      setUserData(null);
    }
  };

  // Fetch user data when token changes
  useEffect(() => {
    getUserData();
  }, [token]);

  // Function to fetch therapists data from backend API
  const getTherapistsData = async () => {
    try {
      // Add timestamp to avoid potential caching issues
      const timestamp = new Date().getTime();
      const response = await axios.get(
        `${backendUrl}/api/user/therapists?_t=${timestamp}`
      );

      const { data } = response;
      if (data.success) {
        setTherapists(data.therapists);

        // Show success message only when therapists are actually loaded
        if (data.therapists && data.therapists.length > 0) {
          // Only show toast on first load, not on refreshes
          if (!therapists || therapists.length === 0) {
            toast.success(
              `Successfully loaded ${data.therapists.length} therapists`
            );
          }
        }
      } else {
        toast.error(data.message || "Failed to fetch therapists");
      }
      return data;
    } catch (error) {}
  };

  // Fetch therapists when component mounts or backendUrl changes
  useEffect(() => {
    getTherapistsData();

    // Set up periodic polling every 5 minutes to keep data fresh
    const intervalId = setInterval(() => {
      getTherapistsData();
    }, 300000); // 5 minutes

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [backendUrl]);

  // Function to update user profile
  const updateUserProfile = async (formData) => {
    if (!token) {
      toast.error("No authentication token found");
      return false;
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setUserData(data.user); // Update userData with the returned user data
        toast.success(data.message || "Profile updated successfully");
        return true;
      } else {
        toast.error(data.error || "Failed to update profile");
        return false;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to update profile");
      }
      return false;
    }
  };

  // Function to book appointment
  const bookAppointment = async (therapistId, slotDate, slotTime) => {
    if (!token) {
      toast.error("Please log in to book appointments");
      return false;
    }

    try {
      const url = `${backendUrl}/api/user/book-appointment`;

      const { data } = await axios.post(
        url,
        {
          therapistId,
          slotDate,
          slotTime,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked successfully");
        // Refresh therapists data to update booked slots
        await getTherapistsData();
        return true;
      } else {
        toast.error(data.error || "Failed to book appointment");
        return false;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to book appointment");
      }
      return false;
    }
  };

  // Helper function to check if appointment time has passed
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

  // Function to get user appointments
  const getUserAppointments = async () => {
    if (!token) {
      return [];
    }

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/my-appointments`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        // Check if any appointments should be marked as completed
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
                  `${backendUrl}/api/user/mark-appointment-completed`,
                  { appointmentId: appointment._id },
                  { headers: { token } }
                )
                .catch(() => {
                  // Silently handle error for background operation
                });
            }
          }
          return appointment;
        });

        return updatedAppointments;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!token) {
      toast.error("Please log in to cancel appointments");
      return false;
    }

    try {
      const url = `${backendUrl}/api/user/cancel-appointment`;

      const { data } = await axios.delete(url, {
        data: { appointmentId },
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message || "Appointment cancelled successfully");
        // Refresh therapists data to update booked slots
        await getTherapistsData();
        return true;
      } else {
        toast.error(data.error || "Failed to cancel appointment");
        return false;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to cancel appointment");
      }
      return false;
    }
  };

  // therapists by specialty
  const therapistsBySpecialty = (specialty) => {
    return therapists.filter(
      (therapist) =>
        therapist.specialties &&
        therapist.specialties.includes(specialty) &&
        therapist.available
    );
  };

  const value = {
    therapists,
    currencySymbol,
    getTherapistsData,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    getUserData,
    updateUserProfile,
    bookAppointment,
    getUserAppointments,
    cancelAppointment,
    therapistsBySpecialty,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
