import React, { useState, useContext, useEffect } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const TherapistManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { aToken, backendUrl, changeAvailability, deleteTherapistAccount } =
    useContext(AdminContext);
  const currencySymbol = "฿";

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
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

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

  // apply filter function to get filtered therapists
  const applyFilter = async (speciality = filter) => {
    try {
      if (speciality === "" || speciality === "All Specialists") {
        setFilteredTherapists(therapists);
      } else {
        const filtered = therapists.filter(
          (therapist) => therapist.speciality === speciality
        );
        setFilteredTherapists(filtered);
      }
    } catch (error) {
      console.error("Error applying filter:", error);
      toast.error("Failed to apply filter");
    }
  };

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
      const therapistList = response.data.therapists || [];
      setTherapists(therapistList);
      setFilteredTherapists(therapistList);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      toast.error("Failed to fetch therapists");
    } finally {
      setListLoading(false);
    }
  };

  // Handle delete therapist
  const handleDeleteTherapist = async (therapistId, therapistName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete therapist "${therapistName}"?`
    );

    if (!confirmDelete) return;

    setDeleteLoading(therapistId);
    try {
      const success = await deleteTherapistAccount(therapistId);
      if (success) {
        fetchTherapists(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting therapist:", error);
      toast.error("Failed to delete therapist");
    } finally {
      setDeleteLoading(null);
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

  // Apply filter when therapists or filter changes
  useEffect(() => {
    applyFilter();
  }, [therapists, filter]);

  return (
    <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Tab Navigation */}
        <div className="mb-10">
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
                  : "text-gray-900 hover:text-gray-950 hover:bg-white"
              }`}
            >
              Add Therapist
            </button>
          </nav>
        </div>

        {/* Add Therapist Tab */}
        {activeTab === "add" && (
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
                    Consultation Fees ({currencySymbol}) *
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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
                All Therapists
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[200px]"
                  >
                    <option value="">All Specialists</option>
                    {specialities.map((specialty, index) => (
                      <option key={index} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={fetchTherapists}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {listLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-gray-600">Loading therapists...</p>
              </div>
            ) : filteredTherapists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {filter
                    ? `No therapists found for "${filter}" specialization.`
                    : "No therapists found."}
                </p>
                {filter && (
                  <button
                    onClick={() => setFilter("")}
                    className="mt-2 text-purple-600 hover:text-purple-800 text-sm underline"
                  >
                    Clear filter to show all therapists
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTherapists.map((therapist) => (
                  <div
                    key={therapist._id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
                  >
                    <div className="text-center">
                      {therapist.image && (
                        <img
                          src={therapist.image}
                          alt={therapist.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-purple-100"
                        />
                      )}
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {therapist.name}
                      </h3>
                      <p className="text-purple-600 font-medium mb-1">
                        {therapist.speciality}
                      </p>
                      <p className="text-green-600 font-semibold mb-3">
                        {currencySymbol}
                        {therapist.fees}
                      </p>

                      {/* Availability Button and Delete Button Row */}
                      <div className="flex flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                        {/* Availability Button */}
                        <button
                          onClick={() =>
                            handleAvailabilityChange(therapist._id)
                          }
                          className={`w-24 h-10 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 flex items-center justify-center text-sm ${
                            therapist.available
                              ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                          }`}
                        >
                          {therapist.available ? "Available" : "Unavailable"}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            handleDeleteTherapist(therapist._id, therapist.name)
                          }
                          disabled={deleteLoading === therapist._id}
                          className={`w-24 h-10 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center text-sm ${
                            deleteLoading === therapist._id
                              ? "bg-gray-400 cursor-not-allowed opacity-70"
                              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95"
                          }`}
                        >
                          {deleteLoading === therapist._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistManagement;
