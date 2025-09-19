"use client";

import React, { useState, useContext, useEffect } from "react";
import { AdminContext } from "../../../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";

const TherapistList = () => {
  const { aToken, backendUrl, changeAvailability, deleteTherapistAccount } =
    useContext(AdminContext);
  const currencySymbol = "฿";

  // Therapist List State
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Specialities list
  const specialities = [
    "All Specialists",
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

  // Fetch therapists when component mounts
  useEffect(() => {
    fetchTherapists();
  }, []);

  // Apply filter when therapists or filter changes
  useEffect(() => {
    applyFilter();
  }, [therapists, filter]);

  return (
    <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
              Therapist Management
            </h1>
            <p className="text-gray-600">Manage all therapists in the system</p>
          </div>
          <Link
            href="/admin/therapists/add"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Add New Therapist
          </Link>
        </div>

        {/* Filter Section */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">
              Filter by Speciality:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {specialities.map((speciality) => (
                <option key={speciality} value={speciality}>
                  {speciality}
                </option>
              ))}
            </select>
            <div className="ml-auto text-sm text-gray-600">
              {filteredTherapists.length} therapist(s) found
            </div>
          </div>
        </div>

        {/* Therapist List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {listLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading therapists...</p>
            </div>
          ) : filteredTherapists.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No therapists found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Therapist
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speciality
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fees
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTherapists.map((therapist) => (
                    <tr key={therapist._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {therapist.image ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover"
                                src={therapist.image}
                                alt={therapist.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-medium">
                                  {therapist.name?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {therapist.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {therapist.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {therapist.speciality}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {therapist.experience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currencySymbol}
                        {therapist.fees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleAvailabilityChange(therapist._id)
                          }
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                            therapist.available
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {therapist.available ? "Available" : "Not Available"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleDeleteTherapist(therapist._id, therapist.name)
                          }
                          disabled={deleteLoading === therapist._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === therapist._id ? (
                            <span className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                              Deleting...
                            </span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistList;
