import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gradient-to-br from-purple-100 via-blue-90 to-white-50 min-h-[500px] md:min-h-[600px] overflow-hidden shadow-lg">
      {/* text section */}
      <div className="text-gray-800 text-center md:text-left flex flex-col gap-8 md:w-1/2 max-w-lg px-4 md:px-16 py-12 z-20">
        <div>
          <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight ">
            MindMeet
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Your Mental Health, Our Priority. Connecting you with trusted
            professionals who care about your wellbeing and mental wellness
            journey.
          </p>
        </div>
        <div className="bg-purple-500 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer space-x-2 w-max">
          <a href="#speciality" className="flex items-center gap-2">
            Book an Appointment
          </a>
          <img
            src={assets.arrow_icon}
            alt="arrow"
            className=" w-4 h-4 filter brightness-0 invert "
          />
        </div>
      </div>

      {/* image section */}
      <div className="absolute right-0 top-0 w-full md:w-1/2 h-full hover:scale-105 transition-transform duration-500 ease-in-out">
        <img
          className="w-full h-full object-cover object-center"
          src={assets.landing_img}
          alt="Mental health illustration showing supportive embrace"
        />
      </div>
    </div>
  );
};

export default Header;
