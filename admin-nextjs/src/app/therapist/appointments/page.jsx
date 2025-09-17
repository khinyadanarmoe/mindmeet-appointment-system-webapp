"use client";

import React, { useContext, useEffect } from "react";
import { TherapistContext } from "../../../contexts/TherapistContext.jsx";

const TherapistAppointments = () => {
  const { dToken, appointments, getAllAppointments } =
    useContext(TherapistContext) || {};

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
    }
  }, [dToken]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-6">
        My Appointments
      </h1>

      {appointments && appointments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {appointment.userData?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(appointment.slotDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {appointment.slotTime}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ฿{appointment.amount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      )}
    </div>
  );
};

export default TherapistAppointments;
