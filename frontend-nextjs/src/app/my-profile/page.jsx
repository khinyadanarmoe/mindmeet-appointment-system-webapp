"use client";

import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import Image from "next/image";

const MyProfile = () => {
  const {
    userData,
    setUserData,
    token,
    backendUrl,
    getUserData,
    updateUserProfile,
  } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async () => {
    if (
      !userData.name ||
      !userData.phone ||
      !userData.dob ||
      !userData.gender
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);

      if (userData.email) formData.append("email", userData.email);
      if (userData.address) formData.append("address", userData.address);
      if (image) formData.append("image", image);

      const success = await updateUserProfile(formData);
      if (success) {
        setIsEditing(false);
        setImage(null);
        // Refresh user data from server
        await getUserData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setUserData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (!userData) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="profile"
      className="bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center py-16"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
          My Profile
        </h2>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Profile Image */}
            <div className="lg:w-1/3 bg-gradient-to-br from-purple-100 to-blue-100 p-8 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="relative mb-6">
                  <Image
                    src={userData.image || assets.profile_pic}
                    alt="Profile"
                    width={224}
                    height={224}
                    className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover shadow-2xl border-4 border-white"
                  />
                  {isEditing && (
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                    >
                      <i className="bi bi-pencil"></i>
                    </label>
                  )}

                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {userData.name}
                </h2>
                <p className="text-gray-600 text-sm">Mental Health Client</p>
              </div>
            </div>

            {/* Right Side - User Data */}
            <div className="lg:w-2/3 p-8 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-person text-gray-400"></i>
                        <p className="text-gray-800 font-medium">
                          {userData.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userData.email || ""}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-envelope text-gray-400"></i>
                        <p className="text-gray-800 font-medium">
                          {userData.email || "Not set"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Phone Number *
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userData.phone || ""}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-telephone text-gray-400"></i>
                        <p className="text-gray-800 font-medium">
                          {userData.phone || "Not set"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Date of Birth *
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formatDateForInput(userData.dob)}
                        onChange={(e) =>
                          setUserData({ ...userData, dob: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-calendar text-gray-400"></i>
                        <p className="text-gray-800 font-medium">
                          {userData.dob
                            ? new Date(userData.dob).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Gender *
                    </label>
                    {isEditing ? (
                      <select
                        value={userData.gender || "not selected"}
                        onChange={(e) =>
                          setUserData({ ...userData, gender: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-gender-ambiguous text-gray-400"></i>
                        <p className="text-gray-800 font-medium">
                          {userData.gender === "not selected"
                            ? "Not set"
                            : userData.gender}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={userData.address || ""}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            address: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <i className="bi bi-geo-alt text-gray-400 mt-0.5"></i>
                        <p className="text-gray-800 font-medium">
                          {userData.address || "Not set"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button at Bottom Right */}
              <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
                {isEditing ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImage(null);
                        getUserData(); // Reset to original data
                      }}
                      disabled={isLoading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateProfile}
                      disabled={isLoading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <i className="bi bi-arrow-clockwise animate-spin"></i>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg"></i>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <i className="bi bi-pencil"></i>
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
