import React from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

import { useNavigate } from "react-router-dom";

const TopProfessionals = () => {
  const navigate = useNavigate();
  const { therapists, getTherapistsData } = useContext(AppContext);

  // Remove debug logs for production security
  // useEffect(() => {
  //   console.log("TopProfessionals - therapists data:", therapists);
  //   console.log("TopProfessionals - therapists length:", therapists?.length);
  // }, [therapists]);

  // Ensure we have fresh data
  useEffect(() => {
    if (getTherapistsData) {
      getTherapistsData();
    }
  }, []);

  return (
    <div className="flex flex-col items-center my-16 px-4 md:px-20">
      <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
        Top Specialists
      </h1>
      <p className="sm:w-1/2 text-center text-gray-600 text-lg leading-relaxed mb-12">
        Carefully selected professionals with experience in therapy and
        counseling.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
        {therapists && therapists.length > 0 ? (
          therapists.slice(0, 5).map((therapist, index) => (
            <div
              key={therapist._id}
              onClick={() => navigate(`/appointment/${therapist._id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  className="w-full object-cover bg-sky-100 group-hover:scale-105 transition-transform duration-300"
                  src={therapist.image}
                  alt={therapist.name}
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

                <p className="text-sm text-gray-600 mb-3">{therapist.degree}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{therapist.experience}</span>
                  <span className="text-lg font-bold text-purple-600">
                    ${therapist.fees}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No therapists available</p>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          navigate("/professionals");
          scrollTo(0, 0);
        }}
        className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        View All Professionals
      </button>
    </div>
  );
};

export default TopProfessionals;
