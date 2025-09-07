import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [docInfo, setDoctorInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    if (!docInfo) {
      console.error("No doctor found with ID:", docId);
      return;
    }
    setDoctorInfo(docInfo);
    console.log("Doctor Info:", docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

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

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setHours(currentDate.getHours() + 1);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!slotTime) {
      alert("Please select a time slot");
      return;
    }

    // make an API call to book the appointment
    alert(
      `Appointment booked with ${docInfo.name} on ${docSlots[
        slotIndex
      ][0]?.datetime.toDateString()} at ${slotTime}`
    );
    navigate("/my-appointments");
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  if (!docInfo) {
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
      {/* Doctor Info Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-sky-100">
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {docInfo.name}
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
                  {docInfo.speciality}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Degree:</span>
                <span className="text-gray-800">{docInfo.degree}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Experience:</span>
                <span className="text-gray-800">{docInfo.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">
                  Consultation Fee:
                </span>
                <span className="text-purple-600 font-bold text-xl">
                  ${docInfo.fees}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">
                {docInfo.about ||
                  `${docInfo.name} is a qualified ${docInfo.speciality} with ${docInfo.experience} of experience. Dedicated to providing compassionate and effective mental health care.`}
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
            {docSlots.length &&
              docSlots.map((item, index) => (
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
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-center py-2 px-3 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                    item.time === slotTime
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {item.time.toLowerCase()}
                </div>
              ))}
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="text-center">
          <button
            onClick={bookAppointment}
            className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!slotTime}
          >
            Book an Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
