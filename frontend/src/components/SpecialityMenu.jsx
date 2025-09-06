import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div id="speciality">
      <h1 className="text-4xl font-bold text-center my-8">
        Find by Specialities
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Choose from a wide range of specialities to find the right professional
        for your needs.
      </p>
      <div className="flex flex-wrap justify-center gap-8 overflow-scroll scrollbar-hide">
        {/* speciality cards */}
        {specialityData.map((item, index) => (
          <Link
            // onClick={() => scrollTo(0, 0)}
            to={`/professionals/${item.speciality}`}
            key={index}
          >
            <div className="w-30 p-4 duration-300 cursor-pointer">
              <img
                src={item.image}
                alt={item.speciality}
                className="w-20 h-20 object-cover rounded-full mx-auto mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-xl font-semibold text-center">
                {item.speciality}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
