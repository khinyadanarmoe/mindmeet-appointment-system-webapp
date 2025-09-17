"use client";

import React, { useContext, useEffect, useState } from "react";
import { TherapistContext } from "../../../contexts/TherapistContext.jsx";

const TherapistDashboard = () => {
  const {
    dToken,
    appointments,
    therapistProfile,
    getAllAppointments,
    getTherapistProfile,
  } = useContext(TherapistContext) || {};

  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalEarnings: 0,
    recentAppointments: [],
  });

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
      getTherapistProfile();
    }
  }, [dToken]);

  useEffect(() => {
    if (appointments && therapistProfile) {
      calculateDashboardData();
    }
  }, [appointments, therapistProfile]);

  const calculateDashboardData = () => {
    if (!appointments || !Array.isArray(appointments)) return;

    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date();

    let todayCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let totalEarnings = 0;

    appointments.forEach((appointment) => {
      const appointmentDate = appointment.slotDate;

      if (appointmentDate === today) {
        todayCount++;
      }

      if (appointment.cancelled) {
        cancelledCount++;
      } else if (appointment.isCompleted) {
        completedCount++;
        totalEarnings += appointment.amount || 0;
      } else {
        const apptDate = new Date(appointmentDate);
        if (apptDate > currentTime) {
          upcomingCount++;
        }
      }
    });

    const recentAppointments = [...appointments]
      .sort((a, b) => new Date(b.slotDate) - new Date(a.slotDate))
      .slice(0, 5);

    setDashboardData({
      totalAppointments: appointments.length,
      todayAppointments: todayCount,
      upcomingAppointments: upcomingCount,
      completedAppointments: completedCount,
      cancelledAppointments: cancelledCount,
      totalEarnings,
      recentAppointments,
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">
            Therapist Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {therapistProfile?.name || "Therapist"}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <i className="bi bi-calendar-check text-2xl text-blue-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.totalAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <i className="bi bi-calendar-day text-2xl text-green-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.todayAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <i className="bi bi-clock text-2xl text-yellow-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardData.upcomingAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <i className="bi bi-currency-dollar text-2xl text-purple-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  ฿{dashboardData.totalEarnings}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Appointments
          </h2>
          {dashboardData.recentAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Patient
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Time
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentAppointments.map(
                    (appointment, index) => (
                      <tr
                        key={appointment._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {appointment.userData?.name || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(appointment.slotDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {appointment.slotTime}
                        </td>
                        <td className="px-4 py-2">
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
                        <td className="px-4 py-2 text-sm font-semibold text-green-600">
                          ฿{appointment.amount || 0}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No recent appointments found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
