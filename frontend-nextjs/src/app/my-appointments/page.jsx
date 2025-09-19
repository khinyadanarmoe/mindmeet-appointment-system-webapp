"use client";

import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MyAppointments = () => {
  const { getUserAppointments, cancelAppointment } = useContext(AppContext);
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const userAppointments = await getUserAppointments();
        setAppointments(userAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [getUserAppointments]);

  // Function to check if appointment can be cancelled (2+ days ahead)
  const canCancel = (appointmentDate) => {
    const today = new Date();
    const apptDate = new Date(appointmentDate);
    const diffTime = apptDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 2;
  };

  // Function to check if user can join (only during appointment time slot)
  const canJoin = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const apptDateTime = new Date(`${appointmentDate}T${appointmentTime}`);

    // Create appointment end time (assuming 1-hour slots)
    const apptEndTime = new Date(apptDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour

    // Can only join if current time is between appointment start time and end time
    return now >= apptDateTime && now < apptEndTime;
  };

  // Function to handle appointment cancellation
  const handleCancel = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const success = await cancelAppointment(appointmentId);
        if (success) {
          // Remove the cancelled appointment from the local state
          setAppointments(
            appointments.filter((apt) => apt._id !== appointmentId)
          );
        }
      } catch (error) {
        console.error("Error cancelling appointment:", error);
      }
    }
  };

  // Function to join Zoom meeting
  const handleJoin = (zoomLink) => {
    if (zoomLink) {
      window.open(zoomLink, "_blank");
    } else {
      alert("Zoom link not available for this appointment");
    }
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
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center py-16"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
          My Appointments
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't booked any appointments yet.
            </p>
            <button
              onClick={() => router.push("/professionals")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Therapist Info */}
                  <div className="flex items-center gap-4 w-1/4">
                    <Image
                      src={
                        appointment.therapistData?.image ||
                        "/default-avatar.png"
                      }
                      alt={appointment.therapistData?.name || "Therapist"}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-full bg-sky-100 shadow-md"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {appointment.therapistData?.name || "Unknown Therapist"}
                      </h3>
                      <p className="text-sm text-purple-600 font-medium">
                        {appointment.therapistData?.speciality || "General"}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 lg:mx-8 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-calendar text-purple-500"></i>
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(appointment.slotDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <i className="bi bi-clock text-purple-500"></i>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-semibold text-gray-900">
                            {formatTime(appointment.slotTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-40">
                    {/* Join Button */}
                    <button
                      onClick={() =>
                        handleJoin(appointment.therapistData?.zoomLink)
                      }
                      disabled={
                        !canJoin(appointment.slotDate, appointment.slotTime)
                      }
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
                        canJoin(appointment.slotDate, appointment.slotTime)
                          ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      title={
                        canJoin(appointment.slotDate, appointment.slotTime)
                          ? "Join the meeting"
                          : "Join button is only available during your appointment time slot"
                      }
                    >
                      <i className="bi bi-camera-video"></i>
                      <span>Join Meeting</span>
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      disabled={!canCancel(appointment.slotDate)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
                        canCancel(appointment.slotDate)
                          ? "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      title={
                        canCancel(appointment.slotDate)
                          ? "Cancel appointment"
                          : "Cannot cancel within 2 days of appointment"
                      }
                    >
                      <i className="bi bi-x-lg"></i>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/professionals")}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book New Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
