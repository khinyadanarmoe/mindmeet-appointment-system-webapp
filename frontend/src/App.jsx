import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Professionals from "./pages/Professionals";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="p-8 pt-0 bg-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/professionals/:specialty" element={<Professionals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
