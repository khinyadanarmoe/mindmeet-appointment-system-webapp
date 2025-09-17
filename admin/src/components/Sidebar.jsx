import React from "react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../../admin-nextjs/public/assets/assets";
import { TherapistContext } from "../context/TherapistContext";

const Sidebar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(TherapistContext);
  const navigate = useNavigate();

  const logout = () => {
    setAToken("");
    setDToken("");
    localStorage.removeItem("aToken");
    localStorage.removeItem("dToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white border-r border-gray-200 w-64 flex flex-col">
      {aToken && (
        <>
          {/* Logo Section */}
          <div className="flex flex-row p-6 border-b border-gray-200 ">
            <img
              src={assets.admin_logo}
              alt="Admin Logo"
              className="h-10 w-auto"
            />
            <p className="mt-5 text-gray-600 text-xs px-2.5 py-0.5 rounded-full border">
              Admin
            </p>
          </div>

          {/* Navigation Links */}
          <nav className=" px-4 py-6">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border-r-4 border-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <img
                    src={assets.home_icon}
                    alt="Dashboard"
                    className="h-5 w-5"
                  />
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/therapist-management"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border-r-4 border-purple-700 "
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <img
                    src={assets.people_icon}
                    alt="Therapist Management"
                    className="h-5 w-5"
                  />
                  Therapist Management
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/all-appointments"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border-r-4 border-b-2 border-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-b border-gray-200 "
                    }`
                  }
                >
                  <img
                    src={assets.appointment_icon}
                    alt="All Appointments"
                    className="h-5 w-5"
                  />
                  All Appointments
                </NavLink>
              </li>
            </ul>
          </nav>

          <hr className="border-t border-gray-200" />

          {/* Logout Section */}
          <div className="p-4">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </>
      )}

      {dToken && (
        <>
          {/* Logo Section */}
          <div className="flex flex-row p-6 border-b border-gray-200">
            <img
              src={assets.admin_logo}
              alt="Therapist Logo"
              className="h-10 w-auto"
            />
            <p className="mt-5 text-gray-600 text-xs px-2.5 py-0.5 rounded-full border">
              Therapist
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-6">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/therapist-dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border-r-4 border-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <img
                    src={assets.home_icon}
                    alt="Dashboard"
                    className="h-5 w-5"
                  />
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/therapist-appointments"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border-r-4 border-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <img
                    src={assets.appointment_icon}
                    alt="My Appointments"
                    className="h-5 w-5"
                  />
                  My Appointments
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/therapist-profile"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border-r-4 border-b-2 border-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <img
                    src={assets.people_icon}
                    alt="My Profile"
                    className="h-5 w-5"
                  />
                  My Profile
                </NavLink>
              </li>
            </ul>
          </nav>

          <hr className="border-t border-gray-200" />

          {/* Logout Section */}
          <div className="p-4">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
