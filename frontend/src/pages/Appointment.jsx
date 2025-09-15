import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
const Appointment = () => {
  const { therapistId } = useParams();
  const navigate = useNavigate();
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
    // Remove sensitive therapist info from console logs
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
      return navigate("/login");
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

      // Simulate payment success (90% success rate for demo)
      const paymentSuccess = Math.random() > 0.1;

      if (!paymentSuccess) {
        toast.error("Payment failed. Please try again.");
        setIsProcessingPayment(false);
        return;
      }

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
        navigate("/my-appointments");
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
          onClick={() => navigate("/professionals")}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Browse All Professionals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Therapist Info Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-sky-100">
            <img
              src={therapistInfo.image}
              alt={therapistInfo.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {therapistInfo.name}
              </h1>
              <img
                src={assets.verified_icon}
                alt="Verified"
                className="w-6 h-6"
              />
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Specialty:</span>
                <span className="text-purple-600 font-semibold">
                  {therapistInfo.speciality}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Degree:</span>
                <span className="text-gray-800">{therapistInfo.degree}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Experience:</span>
                <span className="text-gray-800">
                  {therapistInfo.experience}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">
                  Consultation Fee:
                </span>
                <span className="text-purple-600 font-bold text-xl">
                  ${therapistInfo.fees}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">
                {therapistInfo.about ||
                  `${therapistInfo.name} is a qualified ${therapistInfo.speciality} with ${therapistInfo.experience} of experience. Dedicated to providing compassionate and effective mental health care.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Time Slots
        </h2>

        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Date
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {therapistSlots.length &&
              therapistSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-3 px-2 rounded-lg cursor-pointer transition-all ${
                    slotIndex === index
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <p className="text-xs font-medium">
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                  </p>
                  <p className="text-sm font-bold">
                    {item[0] && item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Time
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {therapistSlots.length &&
              therapistSlots[slotIndex].map((item, index) => {
                // Skip rendering if this is a date-only item with no time
                if (!item.time) return null;

                return (
                  <div
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`text-center py-2 px-3 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                      item.time === slotTime
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.displayTime || item.time}
                  </div>
                );
              })}

            {/* Show message if no time slots available for selected date */}
            {therapistSlots.length &&
              therapistSlots[slotIndex].length === 1 &&
              !therapistSlots[slotIndex][0].time && (
                <div className="col-span-full text-center py-4 text-gray-500">
                  No time slots available for this date
                </div>
              )}
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="text-center">
          <button
            onClick={handleBookAppointment}
            className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!slotTime || isBooking}
          >
            {isBooking ? "Booking..." : "Book an Appointment"}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={closePaymentModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              disabled={isProcessingPayment || isBooking}
            >
              <svg
                className="w-6 h-6"
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
            </button>

            {/* Payment Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Complete Payment
              </h2>
              <p className="text-gray-600">
                Secure payment for your appointment
              </p>
            </div>

            {/* Appointment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Appointment Details
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Therapist:</span>{" "}
                  {therapistInfo?.name}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {therapistSlots[
                    slotIndex
                  ]?.[0]?.datetime?.toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {formatTimeForDisplay(slotTime)}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> 60 minutes
                </p>
              </div>
              <div className="border-t mt-3 pt-3">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-purple-600">
                    ${therapistInfo?.fees}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <div className="flex items-center p-4 border rounded-lg bg-gray-50">
                <svg
                  className="w-8 h-8 mr-3 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Credit/Debit Card
                  </h4>
                  <p className="text-sm text-gray-600">
                    Secure payment processing
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={closePaymentModal}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessingPayment || isBooking}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isProcessingPayment || isBooking}
              >
                {isProcessingPayment ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : isBooking ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Booking...
                  </>
                ) : (
                  `Pay $${therapistInfo?.fees}`
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
