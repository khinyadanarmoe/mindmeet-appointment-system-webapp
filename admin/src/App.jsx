import React from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import { TherapistContext } from "./context/TherapistContext";
import { useContext } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import TherapistManagement from "./pages/Admin/TherapistManagement";
import AllAppointments from "./pages/Admin/AllAppointments";
import TherapistDashboard from "./pages/Therapist/TherapistDashboard";
import TherapistProfile from "./pages/Therapist/TherapistProfile";
import TherapistAppointments from "./pages/Therapist/TherapistAppointments";

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(TherapistContext);

  return aToken || dToken ? (
    <div className="pt-0 bg-white min-h-screen">
      <ToastContainer />

      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/therapist-management"
            element={<TherapistManagement />}
          />
          <Route path="/all-appointments" element={<AllAppointments />} />

          {/* Therapist route */}
          <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
          <Route path="/therapist-profile" element={<TherapistProfile />} />
          <Route
            path="/therapist-appointments"
            element={<TherapistAppointments />}
          />
        </Routes>
      </div>
    </div>
  ) : (
    <div className="p-8 pt-0 bg-white min-h-screen">
      <Login />
      <ToastContainer />
    </div>
  );
}

export default App;
