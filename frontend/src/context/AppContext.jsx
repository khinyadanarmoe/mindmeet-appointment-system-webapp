import React from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "฿";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [therapists, setTherapists] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

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

  const value = {
    therapists,
    currencySymbol,
    getTherapistsData,
    token,
    setToken,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
