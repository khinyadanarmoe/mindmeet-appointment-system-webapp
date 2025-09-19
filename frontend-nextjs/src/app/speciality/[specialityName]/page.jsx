"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SpecialityPage({ params }) {
  const { specialityName } = params;
  const { therapists } = useContext(AppContext);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const router = useRouter();

  // Convert URL format back to display format
  const displaySpeciality = specialityName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    if (therapists && therapists.length > 0) {
      // Filter therapists by speciality
      const filtered = therapists.filter(therapist => 
        therapist.speciality.toLowerCase().includes(displaySpeciality.toLowerCase()) ||
        displaySpeciality.toLowerCase().includes(therapist.speciality.toLowerCase())
      );
      setFilteredTherapists(filtered);
    }
  }, [therapists, displaySpeciality]);

  const navigateToAppointment = (therapistId) => {
    router.push(`/appointment/${therapistId}`);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
        Therapists for "{displaySpeciality}"
      </h2>
      {filteredTherapists.length === 0 ? (
        <p className="text-gray-500 text-center">
          No therapists found for this speciality.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTherapists.map((therapist) => (
            <div 
              key={therapist._id} 
              onClick={() => navigateToAppointment(therapist._id)}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src={therapist.image}
                  alt={therapist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {therapist.name}
                </h3>
                <p className="text-purple-600 font-medium mb-3">
                  {therapist.speciality}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${therapist.fees}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    therapist.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {therapist.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
