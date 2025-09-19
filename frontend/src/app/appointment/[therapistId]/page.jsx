"use client";

import React, { useContext, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppContext } from "../../../contexts/AppContext";
import { toast } from "react-toastify";
import Image from "next/image";

const Appointment = () => {
  const { therapistId } = useParams();
  const router = useRouter();
  const { therapists, bookAppointment, userData, token } =
    useContext(AppContext);

  const [therapistInfo, setTherapistInfo] = useState(null);
  const [therapistSlots, setTherapistSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Helper function to convert 24-hour format to 12-hour format for display
  const formatTimeForDisplay = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const fetchTherapistInfo = async () => {
    const therapistInfo = therapists.find(
      (therapist) => therapist._id === therapistId
    );
    if (!therapistInfo) {
      console.error("No therapist found with ID:", therapistId);
      return;
    }
    setTherapistInfo(therapistInfo);
  };

  const getAvailableSlots = async () => {
    setTherapistSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Format the date for checking booked slots (YYYY-MM-DD)
      const slotDate = currentDate.toISOString().split("T")[0];

      // Setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(16, 0, 0, 0);

      // Setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 8
        );
      } else {
        currentDate.setHours(8);
      }
      currentDate.setMinutes(0);

      let timeSlots = [];

      // Always add the date info as the first item for display purposes
      let dateInfo = new Date(today);
      dateInfo.setDate(today.getDate() + i);
      dateInfo.setHours(8, 0, 0, 0);

      // Get booked slots for this therapist on this date
      const bookedSlotsForDate = therapistInfo?.slots_booked?.[slotDate] || [];

      while (currentDate < endTime) {
        // Use consistent 24-hour format for time matching (HH:MM)
        let formattedTime = currentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Use 24-hour format for consistency
        });

        const now = new Date();

        // Only add time slot if:
        // 1. It's in the future
        // 2. It's not already booked by another patient
        if (currentDate > now && !bookedSlotsForDate.includes(formattedTime)) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime, // 24-hour format for backend
            displayTime: formatTimeForDisplay(formattedTime), // 12-hour format for display
          });
        }

        currentDate.setHours(currentDate.getHours() + 1);
      }

      // If no time slots are available, add just the date info
      if (timeSlots.length === 0) {
        timeSlots.push({
          datetime: dateInfo,
          time: null, // No time available
        });
      }

      setTherapistSlots((prev) => [...prev, timeSlots]);
    }
  };

  const handleBookAppointment = async () => {
    if (!token) {
      toast.warn("Please log in to book appointments");
      return router.push("/login");
    }

    if (!slotTime) {
      toast.warn("Select a time slot");
      return;
    }

    // Show payment modal instead of directly booking
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsProcessingPayment(false);

      // Payment successful, proceed with booking
      toast.success("Payment successful!");
      setIsBooking(true);

      const selectedDate = therapistSlots[slotIndex][0]?.datetime;
      const slotDate = selectedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      const success = await bookAppointment(therapistId, slotDate, slotTime);

      if (success) {
        // Clear selected slot before navigating
        setSlotTime("");
        setShowPayment(false);
        router.push("/my-appointments");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setIsProcessingPayment(false);
      setIsBooking(false);
    }
  };

  const closePaymentModal = () => {
    if (!isProcessingPayment && !isBooking) {
      setShowPayment(false);
    }
  };

  useEffect(() => {
    fetchTherapistInfo();
  }, [therapists, therapistId]);

  useEffect(() => {
    if (therapistInfo) {
      getAvailableSlots();
    }
  }, [therapistInfo]);

  if (!therapistInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Professional Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the professional you're looking for.
        </p>
        <button
          onClick={() => router.push("/professionals")}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          View All Professionals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Therapist Information */}
      <div className="bg-white  shadow-md py-6 pt-0 pb-0 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="relative w-full h-80 bg-sky-100 overflow-hidden ">
              <Image
                src={therapistInfo.image}
                alt={therapistInfo.name}
                width={300}
                height={320}
                className="w-full h-full object-cover"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {therapistInfo.name}
            </h1>
            <p className="text-purple-600 font-medium mb-4">
              {therapistInfo.speciality}
            </p>
            <p className="text-gray-600 mb-4">{therapistInfo.degree}</p>
            <p className="text-gray-700 mb-4">{therapistInfo.about}</p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">Experience:</span>
              <span className="font-medium">{therapistInfo.experience}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-500">Session Fee:</span>
              <span className="text-2xl font-bold text-purple-600">
                ${therapistInfo.fees}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Interface */}
      <div className="bg-white rounded-xl border border-purple-950 shadow-lg p-6 ">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Book an Appointment
        </h2>

        {/* Date Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Date</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {therapistSlots.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setSlotIndex(index);
                  setSlotTime("");
                }}
                className={`flex flex-col items-center p-3 rounded-lg border min-w-[100px] ${
                  slotIndex === index
                    ? "bg-purple-100 border-purple-500"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium">
                  {daysOfWeek[item[0]?.datetime.getDay()]}
                </span>
                <span className="text-lg font-bold">
                  {item[0]?.datetime.getDate()}
                </span>
                <span className="text-xs text-gray-500">
                  {item[0]?.datetime.toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Time</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {therapistSlots[slotIndex]?.map(
              (item, index) =>
                item.time && (
                  <button
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`p-3 rounded-lg border text-sm font-medium ${
                      slotTime === item.time
                        ? "bg-purple-500 text-white border-purple-500"
                        : "border-gray-300 hover:bg-purple-50"
                    }`}
                  >
                    {item.displayTime}
                  </button>
                )
            )}
          </div>
          {therapistSlots[slotIndex]?.every((item) => !item.time) && (
            <p className="text-gray-500 text-center py-4">
              No time slots available for this date
            </p>
          )}
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookAppointment}
          disabled={!slotTime || isBooking}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:cursor-not-allowed transition-colors"
        >
          {isBooking ? "Booking..." : `Book Appointment`}
        </button>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Payment</h3>
            <div className="mb-4">
              <p className="text-gray-600">Session with {therapistInfo.name}</p>
              <p className="text-2xl font-bold text-purple-600">
                ${therapistInfo.fees}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closePaymentModal}
                disabled={isProcessingPayment || isBooking}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessingPayment || isBooking}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isProcessingPayment ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
