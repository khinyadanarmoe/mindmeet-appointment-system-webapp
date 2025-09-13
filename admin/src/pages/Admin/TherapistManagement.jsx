import React, { useState, useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const TherapistManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { aToken, backendUrl, changeAvailability } = useContext(AdminContext);

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
    // available: true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Therapist List State
  const [therapists, setTherapists] = useState([]);
  const [listLoading, setListLoading] = useState(false);

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
      // available: true,
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
        // Switch to list tab to show the new therapist
        setActiveTab("list");
      }
    } catch (error) {
      console.error("Error adding therapist:", error);
      toast.error(error.response?.data?.error || "Failed to add therapist");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all therapists
  const fetchTherapists = async () => {
    setListLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/admin/therapists", {
        headers: {
          token: aToken,
        },
      });
      setTherapists(response.data.therapists || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      toast.error("Failed to fetch therapists");
    } finally {
      setListLoading(false);
    }
  };

  // Handle availability change
  const handleAvailabilityChange = async (therapistId) => {
    try {
      await changeAvailability(therapistId);
      // Refresh the therapist list after successful change
      fetchTherapists();
    } catch (error) {
      console.error("Error changing availability:", error);
    }
  };

  // Fetch therapists when component mounts or when switching to list tab
  useEffect(() => {
    if (activeTab === "list") {
      fetchTherapists();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl  p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("list")}
            className={`py-2 px-6 text-sm font-medium rounded-md transition-colors min-w-[120px] ${
              activeTab === "list"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-gray-700 hover:text-gray-900 hover:bg-white"
            }`}
          >
            All Therapists
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`py-2 px-6 text-sm font-medium rounded-md transition-colors min-w-[120px] ${
              activeTab === "add"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-white"
            }`}
          >
            Add Therapist
          </button>
        </nav>
      </div>

      {/* Add Therapist Tab */}
      {activeTab === "add" && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Zoom Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom Meeting Link *
                </label>
                <input
                  type="url"
                  name="zoomLink"
                  value={formData.zoomLink}
                  onChange={handleInputChange}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Speciality */}
              <div>
                <label className="block text-sm font-small text-gray-700 mb-2">
                  Speciality *
                </label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Speciality</option>
                  {specialities.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
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
                  placeholder="e.g., PhD in Psychology"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Fees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fees ($) *
                </label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About *
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description about the therapist..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* All Therapists Tab */}
      {activeTab === "list" && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Therapists</h2>
            <button
              onClick={fetchTherapists}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {listLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="mt-4 text-gray-600">Loading therapists...</p>
            </div>
          ) : therapists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No therapists found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-6">
              {therapists.map((therapist) => (
                <div
                  key={therapist._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {therapist.image && (
                    <img
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                  )}
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {therapist.name}
                    </h3>
                    <p className="text-purple-600 font-small">
                      {therapist.speciality}
                    </p>

                    <p className="text-green-600 font-medium">
                      ${therapist.fees}
                    </p>
                    <div className="mt-2">
                      <input
                        onChange={() => handleAvailabilityChange(therapist._id)}
                        type="checkbox"
                        checked={therapist.available}
                      />{" "}
                      Available
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TherapistManagement;
