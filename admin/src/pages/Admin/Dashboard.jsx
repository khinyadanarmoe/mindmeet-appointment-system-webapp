import React from "react";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const Dashboard = () => {
  const {
    aToken,
    getDashboardData,
    dashboardData,
    appointments,
    getAllAppointments,
  } = useContext(AdminContext) || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (aToken) {
      try {
        setLoading(true);
        setError(null);
        await getDashboardData();
        await getAllAppointments();
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [aToken]);

  const totalAppointments = dashboardData?.totalAppointments || 0;
  const totalTherapists = dashboardData?.totalTherapists || 0;
  const totalUsers = dashboardData?.totalUsers || 0;

  // Get latest 5 appointments from the appointments state
  const latestAppointments = [...appointments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const completedAppointments =
    appointments?.filter((apt) => apt.isCompleted)?.length || 0;
  const cancelledAppointments =
    appointments?.filter((apt) => apt.cancelled)?.length || 0;
  const scheduledAppointments =
    appointments?.filter((apt) => !apt.cancelled && !apt.isCompleted)?.length ||
    0;

  // Show loading state
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={refreshData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          disabled={loading}
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
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
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Appointments
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {totalAppointments}
              </p>
            </div>
          </div>
        </div>

        {/* Total Therapists */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Therapists
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {totalTherapists}
              </p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9  0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-purple-600">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Appointment Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Scheduled</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                {scheduledAppointments}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                {completedAppointments}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelled</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                {cancelledAppointments}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* latest 5 appointments */}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Latest Appointments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                  Patient Name
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                  Therapist Name
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                  Date & Time
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {latestAppointments.length > 0 ? (
                latestAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {apt.userData?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {apt.therapistData?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {apt.slotDate} at {apt.slotTime}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          apt.cancelled
                            ? "bg-red   -100 text-red-800"
                            : apt.isCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {apt.cancelled
                          ? "Cancelled"
                          : apt.isCompleted
                          ? "Completed"
                          : "Scheduled"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 border-b text-center text-sm text-gray-500"
                  >
                    No recent appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
