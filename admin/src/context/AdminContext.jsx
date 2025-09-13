import React from "react";
import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Function to fetch all therapists
  const fetchAllTherapists = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/therapist/all/`, {
        headers: { aToken },
      });
      return data;
    } catch (error) {
      console.error("Error fetching therapists:", error);
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

  const value = {
    aToken,
    setAToken,
    backendUrl,
    fetchAllTherapists,
    changeAvailability,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
