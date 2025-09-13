import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { token, setToken } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="h-8"
      />
      <ul className="hidden md:flex gap-6 font-medium text-gray-700">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/professionals">
          <li className="py-1">Our Professionals</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex gap-4">
        {token ? (
          <div className="relative group">
            <div className="bg-white text-blue-600 border border-gray-300 px-6 py-2 rounded-full hover:bg-blue-50 hidden md:flex items-center cursor-pointer font-light transition-colors duration-200">
              <img
                src={assets.profile_pic}
                alt="user"
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>Ms. Moe</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <div
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => navigate("/my-profile")}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      My Profile
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => navigate("/my-appointments")}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      My Appointments
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                  onClick={logout}
                >
                  <p className="text-sm font-medium text-gray-900">Logout</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 hidden md:block font-light"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
