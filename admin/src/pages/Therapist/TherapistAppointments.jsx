import React from "react";
import { useContext, useState } from "react";
import { TherapistContext } from "../../context/TherapistContext";
import { useEffect } from "react";

const TherapistAppointments = () => {
  const { dToken, appointments, getAllAppointments } =
    useContext(TherapistContext) || {};

  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
    }
  }, [dToken]);

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
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="flex flex-col space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
            My Appointments
          </h2>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Sort */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOrder === "asc" ? "↑ Date" : "↓ Date"}
              </button>
            </div>
          </div>
        </div>

        {sortedAppointments && sortedAppointments.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Therapist Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date {sortOrder === "asc" ? "↑" : "↓"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAppointments.map((appointment, index) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.userData?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.therapistData?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.slotDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.slotTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${appointment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="text-center py-8">
              <p className="text-gray-500">
                {statusFilter === "all"
                  ? "No appointments found."
                  : `No ${statusFilter} appointments found.`}
              </p>
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="mt-2 text-purple-600 hover:text-purple-800 text-sm"
                >
                  Show all appointments
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistAppointments;
