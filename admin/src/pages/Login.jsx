import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { TherapistContext } from "../context/TherapistContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(TherapistContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      console.log("Attempting login:", {
        state,
        email,
        endpoint:
          state === "Admin" ? "/api/admin/login" : "/api/therapist/login",
      });

      const endpoint =
        state === "Admin" ? "/api/admin/login" : "/api/therapist/login";
      const response = await axios.post(backendUrl + endpoint, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (state === "Admin" && response.data.token) {
        setAToken(response.data.token);
        localStorage.setItem("aToken", response.data.token);
        toast.success("Admin login successful!");
      } else if (state === "Doctor" && response.data.token) {
        setDToken(response.data.token);
        localStorage.setItem("dToken", response.data.token);
        toast.success("Therapist login successful!");
      } else {
        toast.error(
          response.data.message || "Login failed - no token received"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
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
            className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Login
          </button>
          <div>
            {state === "Admin" ? (
              <div
                className="pl-0 p-4 text-blue-600 cursor-pointer hover:text-blue-800"
                onClick={() => setState("Doctor")}
              >
                Login as Doctor
              </div>
            ) : (
              <div
                className="pl-0 p-4 text-blue-600 cursor-pointer hover:text-blue-800"
                onClick={() => setState("Admin")}
              >
                Login as Admin
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
