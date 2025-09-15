import React, { use, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const TherapistContext = createContext();

const TherapistContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = React.useState(
    localStorage.getItem("dToken") || null
  );
  const [appointments, setAppointments] = React.useState([]);
  const [therapistProfile, setTherapistProfile] = React.useState(null);
  const [dashboardData, setDashboardData] = React.useState(null);

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
      const { data } = await axios.get(`${backendUrl}/api/therapist/profile`, {
        headers: { token: dToken },
      });

      if (data.success) {
        setTherapistProfile(data.therapist);
        return data.therapist;
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

  // Function to get all appointments and store in state
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/therapist/appointments`,
        {
          headers: { token: dToken },
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
        return data.appointments;
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
        `${backendUrl}/api/therapist/update-profile`,
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
        toast.success(data.message || "Profile updated successfully");
        return true;
      } else {
        toast.error(data.message || "Failed to update profile");
        return false;
      }
    } catch (error) {
      console.error("Error updating therapist profile:", error);
      toast.error("Failed to update profile");
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
