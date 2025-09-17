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
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
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
      const { data } = await axios.get(`${backendUrl}/api/admin/therapists`, {
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
        `${backendUrl}/api/admin/delete-therapist/${therapistId}`,
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
        `${backendUrl}/api/admin/change-availability`,
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
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard-data`,
        {
          headers: { token: aToken },
        }
      );

      if (data.success) {
        setDashboardData(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  // Get all appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { token: aToken },
      });

      if (data.success) {
        setAppointments(data.appointments);
        return data.appointments;
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
