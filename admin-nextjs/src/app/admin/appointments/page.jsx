"use client";

import React from "react";
import { useContext, useState } from "react";
import { AdminContext } from "../../../contexts/AdminContext.jsx";
import { useEffect } from "react";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments } =
    useContext(AdminContext) || {};

  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const sortAppointmentsByDate = (appointments, order) => {
    if (!appointments) return [];

    return appointments.slice().sort((a, b) => {
      const dateA = new Date(a.slotDate);
      const dateB = new Date(b.slotDate);

      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const filterAppointmentsByStatus = (appointments, filter) => {
    if (!appointments) return [];

    if (filter === "all") return appointments;

    return appointments.filter((appointment) => {
      if (filter === "completed") return appointment.isCompleted;
      if (filter === "cancelled") return appointment.cancelled;
      if (filter === "scheduled")
        return !appointment.cancelled && !appointment.isCompleted;
      return true;
    });
  };

  const filteredAppointments = filterAppointmentsByStatus(
    appointments,
    statusFilter
  );
  const sortedAppointments = sortAppointmentsByDate(
    filteredAppointments,
    sortOrder
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
            All Appointments
          </h1>
        </div>

        {/* Filter and Sort Controls */}
        <div className="p-6 ">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort:</label>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                {sortOrder === "asc"
                  ? "↑ Date (Oldest First)"
                  : "↓ Date (Newest First)"}
              </button>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              {sortedAppointments.length} appointment(s) found
            </div>
          </div>
        </div>

        {sortedAppointments && sortedAppointments.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Therapist
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date {sortOrder === "asc" ? "↑" : "↓"}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAppointments.map((appointment, index) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.userData?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.userData?.email || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.therapistData?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.therapistData?.speciality || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(appointment.slotDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.slotTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ฿{appointment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            appointment.cancelled
                              ? "bg-red-100 text-red-800"
                              : appointment.isCompleted
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.cancelled
                            ? "Cancelled"
                            : appointment.isCompleted
                            ? "Completed"
                            : "Scheduled"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600">No appointments found</p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Show all appointments
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
