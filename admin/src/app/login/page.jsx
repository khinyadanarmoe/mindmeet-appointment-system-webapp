"use client";

import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../../contexts/AdminContext.jsx";
import { TherapistContext } from "../../contexts/TherapistContext.jsx";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(TherapistContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Debug: Check what environment variables are available
      console.log("DEBUG - NODE_ENV:", process.env.NODE_ENV);
      console.log(
        "DEBUG - NEXT_PUBLIC_BACKEND_URL:",
        process.env.NEXT_PUBLIC_BACKEND_URL
      );

      // Use direct backend URL to avoid basePath issues
      const directBackendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      console.log("DEBUG - directBackendUrl:", directBackendUrl);

      const endpoint = state === "Admin" ? "/admin/login" : "/therapist/login";

      // Construct the full URL correctly with proper slash handling
      const fullUrl = `${directBackendUrl}/${endpoint}`.replace(
        /([^:]\/)\/+/g,
        "$1"
      );
      console.log("DEBUG - fullUrl:", fullUrl);

      const response = await axios.post(fullUrl, {
        email,
        password,
      });

      if (state === "Admin" && response.data.token) {
        setAToken(response.data.token);
        localStorage.setItem("aToken", response.data.token);
        toast.success("Admin login successful!");
        router.push("/admin/dashboard");
      } else if (state === "Therapist" && response.data.token) {
        setDToken(response.data.token);
        localStorage.setItem("dToken", response.data.token);
        toast.success("Therapist login successful!");
        router.push("/therapist/dashboard");
      } else {
        toast.error(
          response.data.message || "Login failed - no token received"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {state} Login
          </h2>
          <p className="text-gray-600">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6 flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setState("Admin")}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              state === "Admin"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setState("Therapist")}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              state === "Therapist"
                ? "bg-blue-700 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Therapist
          </button>
        </div>

        <form
          className="bg-white shadow-md rounded-lg px-8 py-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white px-4 py-2 rounded-lg transition-colors ${
              state === "Admin"
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-blue-700 hover:bg-blue-900"
            }`}
          >
            Login as {state}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
