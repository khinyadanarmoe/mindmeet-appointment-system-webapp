"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <Image
        onClick={() => router.push("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="MindMeet Logo"
        width={176}
        height={60}
        priority
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <li>
          <Link
            href="/"
            className="py-1 hover:text-purple-600 transition-colors duration-200"
          >
            HOME
          </Link>
          <hr
            className={`border-none outline-none h-0.5 bg-purple-600 w-3/5 m-auto ${
              pathname === "/" ? "block" : "hidden"
            }`}
          />
        </li>
        <li>
          <Link
            href="/professionals"
            className="py-1 hover:text-purple-600 transition-colors duration-200"
          >
            ALL PROFESSIONALS
          </Link>
          <hr
            className={`border-none outline-none h-0.5 bg-purple-600 w-3/5 m-auto ${
              pathname === "/professionals" ||
              pathname.startsWith("/therapists") ||
              pathname.startsWith("/appointment")
                ? "block"
                : "hidden"
            }`}
          />
        </li>
        <li>
          <Link
            href="/about"
            className="py-1 hover:text-purple-600 transition-colors duration-200"
          >
            ABOUT
          </Link>
          <hr
            className={`border-none outline-none h-0.5 bg-purple-600 w-3/5 m-auto ${
              pathname === "/about" ? "block" : "hidden"
            }`}
          />
        </li>
        <li>
          <Link
            href="/contact"
            className="py-1 hover:text-purple-600 transition-colors duration-200"
          >
            CONTACT
          </Link>
          <hr
            className={`border-none outline-none h-0.5 bg-purple-600 w-3/5 m-auto ${
              pathname === "/contact" ? "block" : "hidden"
            }`}
          />
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <div className="hidden md:flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-150">
              <Image
                src={userData.image}
                alt="user"
                className="w-10 h-10 rounded-full mr-2"
                width={24}
                height={24}
              />
              <span className="font-bold">{userData.name}</span>
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
                  onClick={() => router.push("/my-profile")}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      My Profile
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => router.push("/my-appointments")}
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
            onClick={() => router.push("/login")}
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
