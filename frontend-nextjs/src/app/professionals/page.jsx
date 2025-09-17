"use client";

import React from "react";
import { useContext, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppContext } from "../../contexts/AppContext";
import Image from "next/image";

const Professionals = () => {
  const router = useRouter();
  const params = useParams();
  const speciality = params?.speciality;
  const { therapists, getTherapistsData } = useContext(AppContext) || {};

  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(
    speciality || ""
  );

  const specialties = [
    "Counselor",
    "Clinical Psychologist",
    "Psychiatrist",
    "Marriage Therapist",
    "Child Psychologist",
    "Addiction Counselor",
    "Behavioral Therapist",
  ];

  {
    /*    "Counselor",
    "Clinical Psychologist",//
    "Psychiatrist",//
    "Marriage Therapist",//
    "Child Psychologist",//
    "Addiction Counselor",//
    "Behavioral Therapist", //*/
  }

  const applyFilter = (filterSpeciality) => {
    if (filterSpeciality && filterSpeciality !== "") {
      const filtered = therapists.filter(
        (therapist) =>
          therapist.speciality.toLowerCase() === filterSpeciality.toLowerCase()
      );
      setFilteredTherapists(filtered);
    } else {
      setFilteredTherapists(therapists);
    }
    setSelectedSpeciality(filterSpeciality || "");
  };

  useEffect(() => {
    if (therapists && therapists.length > 0) {
      if (speciality) {
        applyFilter(speciality);
      } else {
        setFilteredTherapists(therapists);
      }
    }
  }, [speciality, therapists]);

  return (
    <div className="flex flex-col gap-8 pt-5  px-4 md:px-20">
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

      {/* Therapists Grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredTherapists && filteredTherapists.length > 0 ? (
            filteredTherapists.map((therapist, index) => (
              <div
                key={therapist._id}
                onClick={() => router.push(`/appointment/${therapist._id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
              >
                <div className="relative overflow-hidden h-64 w-full">
                  <Image
                    className="w-full h-full object-cover bg-blue-50 group-hover:scale-105 transition-transform duration-300"
                    src={therapist.image}
                    alt={therapist.name}
                    width={300}
                    height={300}
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-600 font-medium">
                      {therapist.speciality}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {therapist.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {therapist.degree}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {therapist.experience}
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      ${therapist.fees}
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
