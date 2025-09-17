"use client";

import React, { useState, useContext } from "react";
import { AdminContext } from "../../../../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AddTherapist = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const router = useRouter();

  // Add Therapist Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    zoomLink: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    fees: "",
    address: "",
    available: true, // Default to available
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Specialities list
  const specialities = [
    "Counselor",
    "Clinical Psychologist",
    "Psychiatrist",
    "Marriage Therapist",
    "Child Psychologist",
    "Addiction Counselor",
    "Behavioral Therapist",
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      zoomLink: "",
      speciality: "",
      degree: "",
      experience: "",
      about: "",
      fees: "",
      address: "",
      available: true, // Reset to available
    });
    setImage(null);
  };

  // Submit form to add therapist
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a therapist image");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      // Append image if selected
      if (image) {
        form.append("image", image);
      }

      const response = await axios.post(
        backendUrl + "/api/admin/add-therapist",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: aToken,
          },
        }
      );

      if (response.data.message) {
        toast.success("Therapist added successfully!");
        resetForm();
        // Redirect to therapist list
        router.push("/admin/therapists");
      }
    } catch (error) {
      console.error("Error adding therapist:", error);
      toast.error(error.response?.data?.error || "Failed to add therapist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/admin/therapists"
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            ← Back to Therapists
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-10">
            Add New Therapist
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Image Upload */}
              <div className="col-span-full flex flex-col items-center">
                <div
                  onClick={() =>
                    document.getElementById("therapist-image-input").click()
                  }
                  className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-purple-500 cursor-pointer transition-colors flex items-center justify-center overflow-hidden bg-gray-50"
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Selected"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">Click to upload</p>
                    </div>
                  )}
                </div>
                <input
                  id="therapist-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload therapist profile photo
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  minLength={6}
                />
              </div>

              {/* Speciality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speciality *
                </label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Speciality</option>
                  {specialities.map((speciality) => (
                    <option key={speciality} value={speciality}>
                      {speciality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., PhD in Psychology"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                  required
                />
              </div>

              {/* Fees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fees (฿) *
                </label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  required
                />
              </div>

              {/* Zoom Link */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom Meeting Link *
                </label>
                <input
                  type="url"
                  name="zoomLink"
                  value={formData.zoomLink}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://zoom.us/j/..."
                  required
                />
              </div>

              {/* Availability Status */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Availability Status
                </label>
                <div className="flex items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Available for appointments
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.available 
                    ? "Therapist will be available for new appointments" 
                    : "Therapist will be unavailable for new appointments"
                  }
                </p>
              </div>

              {/* Address */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                ></textarea>
              </div>

              {/* About */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About *
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about the therapist's background, expertise, and approach..."
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding Therapist...
                  </span>
                ) : (
                  "Add Therapist"
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTherapist;
