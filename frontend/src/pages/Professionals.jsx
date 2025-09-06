import React from "react";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { doctors as fallbackDoctors } from "../assets/assets";

const Professionals = () => {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext) || {};

  const doctorsData = doctors || fallbackDoctors;

  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  const [selectedSpeciality, setSelectedSpeciality] = useState(
    speciality || ""
  );

  const specialties = [
    "Psychologist",
    "Psychiatrist",
    "Therapist",
    "Counselor",
    "Family Therapist",
    "Child Psychologist",
  ];

  const applyFilter = (filterSpeciality) => {
    if (filterSpeciality && filterSpeciality !== "") {
      const filtered = doctorsData.filter(
        (doctor) =>
          doctor.speciality.toLowerCase() === filterSpeciality.toLowerCase()
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctorsData);
    }
    setSelectedSpeciality(filterSpeciality || "");
  };

  useEffect(() => {
    if (speciality) {
      applyFilter(speciality);
    } else {
      setFilteredDoctors(doctorsData);
    }
  }, [speciality, doctorsData]);

  console.log("Current speciality:", speciality);
  console.log("Filtered doctors:", filteredDoctors);

  return (
    <div className="flex flex-col gap-8 pt-5 border-t px-4 md:px-20">
      {/* Header and Dropdown Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our Specialists
          </h1>
          <p className="text-gray-600 mt-2">
            Browse through our qualified mental health professionals
          </p>
        </div>

        {/* Dropdown Filter */}
        <div className="flex flex-col gap-2 mt-8">
          <select
            id="speciality-filter"
            value={selectedSpeciality}
            onChange={(e) => applyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white min-w-[200px] text-gray-700"
          >
            <option value="">All Specialists</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <div
                key={doctor._id}
                onClick={() => navigate(`/appointment/${doctor._id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    className="w-full object-cover bg-blue-50 group-hover:scale-105 transition-transform duration-300"
                    src={doctor.image}
                    alt={doctor.name}
                  />
                </div>

                <div className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-600 font-medium">
                      {doctor.speciality}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {doctor.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">{doctor.degree}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{doctor.experience}</span>
                    <span className="text-lg font-bold text-purple-600">
                      ${doctor.fees}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No specialists found
                </h3>
                <p className="text-gray-500 mb-6">
                  {selectedSpeciality
                    ? `We couldn't find any specialists in "${selectedSpeciality}". Try browsing all specialists or choose a different specialty.`
                    : "No specialists are currently available. Please try again later."}
                </p>
                {selectedSpeciality && (
                  <button
                    onClick={() => applyFilter("")}
                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    View All Specialists
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Professionals;
