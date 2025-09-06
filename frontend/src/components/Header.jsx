import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-[500px] md:min-h-[600px] overflow-hidden shadow-lg">
      {/* text section */}
      <div className="text-gray-800 text-center md:text-left flex flex-col gap-8 md:w-1/2 max-w-lg px-4 md:px-16 py-12 z-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            MindMeet
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Your Mental Health, Our Priority. Connecting you with trusted
            professionals who care about your wellbeing and mental wellness
            journey.
          </p>
        </div>
        <div>
          <a
            href="#speciality"
            className="bg-purple-400 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book an Appointment
          </a>
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
