"use client";

import React, { useContext, useEffect, useState } from "react";
import { TherapistContext } from "../../../contexts/TherapistContext.jsx";
import { toast } from "react-toastify";
import Image from "next/image";

const TherapistProfile = () => {
  const {
    dToken,
    therapistProfile,
    getTherapistProfile,
    updateTherapistProfile,
  } = useContext(TherapistContext) || {};

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    address: "",
    zoomLink: "",
  });

  useEffect(() => {
    if (dToken) {
      getTherapistProfile();
    }
  }, [dToken]);

  useEffect(() => {
    if (therapistProfile) {
      console.log("Therapist Profile Data:", therapistProfile);
      setFormData({
        about: therapistProfile.about || "",
        address: therapistProfile.address || "",
        zoomLink: therapistProfile.zoomLink || "",
      });
    }
  }, [therapistProfile]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL for immediate display
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Only add non-empty values
      Object.keys(formData).forEach((key) => {
        if (key !== "image" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (image) {
        formDataToSend.append("image", image);
      }

      const success = await updateTherapistProfile(formDataToSend);
      if (success) {
        setIsEditing(false);
        setImage(null);
        toast.success("Profile updated successfully!");
        // Refresh profile data
        await getTherapistProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!therapistProfile) {
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
                    src={
                      formData.image ||
                      therapistProfile.image ||
                      "/profile_pic.png"
                    }
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
                      <i className="bi bi-camera text-lg"></i>
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
                  {formData.name || therapistProfile.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {therapistProfile.speciality || "Mental Health Professional"}
                </p>
                <div className="mt-4 bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Session Fee</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${therapistProfile.fees || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Therapist Data */}
            <div className="lg:w-2/3 p-8 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name - Read Only */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Full Name
                      </label>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.name}
                      </p>
                    </div>

                    {/* Email - Read Only */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Email Address
                      </label>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.email}
                      </p>
                      {/* Debug information - remove in production */}
                      <p className="text-xs text-gray-400 mt-1">
                        Email value: {JSON.stringify(therapistProfile.email)}
                      </p>
                    </div>

                    {/* Speciality - Read Only */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Speciality
                      </label>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.speciality || "Not set"}
                      </p>
                    </div>

                    {/* Fees - Read Only */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Session Fee ($)
                      </label>
                      <p className="text-gray-800 font-medium">
                        ${therapistProfile.fees || "Not set"}
                      </p>
                    </div>

                    {/* Degree - Read Only */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Degree
                      </label>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.degree || "Not set"}
                      </p>
                    </div>

                    {/* Experience - Read Only */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Experience (Years)
                      </label>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.experience || "Not set"}
                      </p>
                    </div>

                    {/* Zoom Link - Editable */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Zoom Meeting Link
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          name="zoomLink"
                          value={formData.zoomLink}
                          onChange={handleInputChange}
                          placeholder="https://zoom.us/j/..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : therapistProfile.zoomLink ? (
                        <a
                          href={therapistProfile.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 font-medium underline"
                        >
                          {therapistProfile.zoomLink}
                        </a>
                      ) : (
                        <p className="text-gray-800 font-medium">Not set</p>
                      )}
                    </div>

                    {/* Address - Editable */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">
                          {therapistProfile.address || "Not set"}
                        </p>
                      )}
                    </div>

                    {/* About - Editable */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600">
                        About Me
                      </label>
                      {isEditing ? (
                        <textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">
                          {therapistProfile.about || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Edit Button at Bottom Right */}
              <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
                {isEditing ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImage(null);
                        // Reset form data to original (only editable fields)
                        setFormData({
                          about: therapistProfile.about || "",
                          address: therapistProfile.address || "",
                          zoomLink: therapistProfile.zoomLink || "",
                        });
                      }}
                      disabled={isLoading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin">🔄</span>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
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

export default TherapistProfile;
