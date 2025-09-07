import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  // Mock appointments data with different dates and times
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: doctors[0],
      date: "2025-09-15", // 8 days ahead - can cancel
      time: "14:00",
      status: "confirmed",
      zoomLink: "https://zoom.us/j/1234567890",
    },
    {
      id: 2,
      doctor: doctors[1],
      date: "2025-09-08", // 1 day ahead - cannot cancel
      time: "10:30",
      status: "confirmed",
      zoomLink: "https://zoom.us/j/0987654321",
    },
    {
      id: 3,
      doctor: doctors[2],
      date: "2025-09-07", // Today - can join if time is right
      time: "16:00",
      status: "confirmed",
      zoomLink: "https://zoom.us/j/1122334455",
    },
  ]);

  // Function to check if appointment can be cancelled (2+ days ahead)
  const canCancel = (appointmentDate) => {
    const today = new Date();
    const apptDate = new Date(appointmentDate);
    const diffTime = apptDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 2;
  };

  // Function to check if user can join (appointment time ±30 minutes)
  const canJoin = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const apptDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const diffMs = Math.abs(now - apptDateTime);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 30; // Can join 30 minutes before/after appointment time
  };

  // Function to handle appointment cancellation
  const handleCancel = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
      alert("Appointment cancelled successfully!");
    }
  };

  // Function to join Zoom meeting
  const handleJoin = (zoomLink) => {
    window.open(zoomLink, "_blank");
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      id="my-appointments"
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex  justify-center py-16"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
          My Appointments
        </h2>

        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Doctor Info */}
                <div className="flex items-center gap-4 w-1/3">
                  <img
                    src={appointment.doctor?.image}
                    alt={appointment.doctor?.name}
                    className="w-16 h-16 object-cover rounded-full bg-sky-100 shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {appointment.doctor?.name}
                    </h3>
                    <p className="text-sm text-purple-600 font-medium">
                      {appointment.doctor?.speciality}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.doctor?.experience}
                    </p>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex-1 lg:mx-8 ">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(appointment.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-semibold text-gray-900">
                          {formatTime(appointment.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-40">
                  {/* Join Button */}
                  <button
                    onClick={() => handleJoin(appointment.zoomLink)}
                    disabled={!canJoin(appointment.date, appointment.time)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
                      canJoin(appointment.date, appointment.time)
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    title={
                      canJoin(appointment.date, appointment.time)
                        ? "Join the meeting"
                        : "Join button available 30 minutes before appointment time"
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Join Meeting</span>
                  </button>

                  {/* Cancel Button */}
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    disabled={!canCancel(appointment.date)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
                      canCancel(appointment.date)
                        ? "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    title={
                      canCancel(appointment.date)
                        ? "Cancel appointment"
                        : "Cannot cancel within 2 days of appointment"
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/professionals")}
            className=" bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book New Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
