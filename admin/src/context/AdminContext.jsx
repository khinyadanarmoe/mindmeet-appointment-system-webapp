import React from "react";
import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [dashboardData, setDashboardData] = useState(false);

  // Function to get all therapists and store in state
  const getAllTherapists = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/therapists`, {
        headers: { token: aToken },
      });

      if (data.success) {
        setTherapists(data.therapists);
        return data.therapists;
      } else {
        toast.error(data.message || "Failed to fetch therapists");
        return [];
      }
    } catch (error) {
      console.error("Error fetching therapists:", error);
      toast.error("Failed to fetch therapists");
      throw error;
    }
  };

  // Function to change therapist availability
  const changeAvailability = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { therapistId: id },
        {
          headers: {
            token: aToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success("Availability updated successfully");
        return data;
      } else {
        toast.error(data.message || "Failed to change availability");
      }
    } catch (error) {
      console.error("Error changing availability:", error);
      toast.error("Failed to change availability");
      throw error;
    }
  };

  // Context value to be provided to get all appointments
  const getAllAppointments = async () => {
    try {
      if (!aToken) {
        toast.error("Admin authentication required");
        return [];
      }

      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { token: aToken },
      });

      if (data.success) {
        // Sort appointments by creation date (latest first)
        const sortedAppointments = data.appointments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAppointments(sortedAppointments);
        return sortedAppointments;
      } else {
        toast.error(data.message || "Failed to fetch appointments");
        return [];
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);

      if (error.response?.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        setAToken(null);
        localStorage.removeItem("aToken");
      } else if (error.code === "ECONNREFUSED") {
        toast.error(
          "Server connection failed. Please check if server is running."
        );
      } else {
        toast.error("Failed to fetch appointments");
      }
      throw error;
    }
  };

  const getDashboardData = async () => {
    try {
      if (!aToken) {
        toast.error("Admin authentication required");
        return null;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard-data`,
        {
          headers: { token: aToken },
        }
      );

      if (data.success) {
        setDashboardData(data);
        return data;
      } else {
        toast.error(data.message || "Failed to fetch dashboard data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error.response?.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        setAToken(null);
        localStorage.removeItem("aToken");
      } else if (error.code === "ECONNREFUSED") {
        toast.error(
          "Server connection failed. Please check if server is running."
        );
      } else {
        toast.error("Failed to fetch dashboard data");
      }
      throw error;
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    getAllTherapists,
    therapists,
    setTherapists,
    changeAvailability,
    getAllAppointments,
    appointments,
    setAppointments,
    getDashboardData,
    dashboardData,
    setDashboardData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
