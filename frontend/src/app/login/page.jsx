"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assets } from "../../assets/assets";
import { AppContext } from "../../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const router = useRouter();
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (state === "Sign Up") {
        // Handle registration
        const registerUrl = `${backendUrl}/user/register`;

        try {
          const response = await axios.post(registerUrl, {
            name,
            email,
            password,
          });

          if (response.data.success && response.data.token) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Account created successfully!");
            router.push("/");
          } else {
            toast.error(response.data.message || "Registration failed");
          }
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.error || "Registration failed");
          } else if (error.request) {
            toast.error(
              "No response from server. Please check your connection."
            );
          } else {
            toast.error("Error processing your request. Please try again.");
          }
        }
      } else {
        // Handle login
        const loginUrl = `${backendUrl}/user/login`;

        try {
          const response = await axios.post(loginUrl, {
            email,
            password,
          });

          if (response.data.success && response.data.token) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Login successful!");
            router.push("/");
          } else {
            toast.error(response.data.message || "Login failed");
          }
        } catch (error) {
          if (error.response) {
            toast.error(
              error.response.data.error || "Invalid email or password"
            );
          } else if (error.request) {
            toast.error(
              "No response from server. Please check your connection."
            );
          } else {
            toast.error("Error processing your request. Please try again.");
          }
        }
      }
    } catch (error) {
      // More detailed error logging
      if (error.name === "SyntaxError") {
        toast.error(
          "Server returned an invalid response. Please try again later."
        );
      } else if (
        error.name === "TypeError" &&
        error.message.includes("NetworkError")
      ) {
        toast.error(
          "Network error. Please check your connection to the server."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600">
            {state === "Sign Up"
              ? "Join MindMeet and start your mental wellness journey"
              : "Sign in to access your mental health dashboard"}
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Name Field (only for signup) */}
            {state === "Sign Up" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bi bi-person text-gray-400"></i>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={state === "Sign Up"}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    } text-gray-400 hover:text-gray-600`}
                  ></i>
                </button>
              </div>
              {state === "Sign Up" && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="bi bi-arrow-clockwise animate-spin mr-2"></i>
                  {state === "Sign Up"
                    ? "Creating Account..."
                    : "Signing In..."}
                </div>
              ) : state === "Sign Up" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Forgot Password (only for login) */}
          {state === "Login" && (
            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-500 font-medium"
              >
                Forgot your password?
              </a>
            </div>
          )}

          {/* Switch between Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {state === "Sign Up"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                {state === "Sign Up" ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Your mental health data is protected and secure with MindMeet
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
