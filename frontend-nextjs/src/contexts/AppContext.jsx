"use client";

import React from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "฿";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
      const { data } = await axios.get(`${backendUrl}/api/user/get-user-info`, {
        headers: { token },
      });
      if (data.success && data.user) {
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      const { data } = await axios.get(`${backendUrl}/api/therapist/list`);
      if (data.success && data.therapists) {
        setTherapists(data.therapists);
        return data.therapists;
      } else {
        console.error("Failed to fetch therapists:", data.message);
        setTherapists([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setTherapists([]);
      return [];
    }
  };

  // Fetch therapists when component mounts
  useEffect(() => {
    getTherapistsData();
  }, []);

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
      console.error("Error updating profile:", error);
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
      console.error("Error booking appointment:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to book appointment");
      }
      return false;
    }
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
        return data.appointments;
      } else {
        console.error("Failed to fetch appointments:", data.error);
        return [];
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
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
      console.error("Error cancelling appointment:", error);
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
