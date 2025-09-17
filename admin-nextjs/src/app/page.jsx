"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-purple-900 mb-6">
          MindMeet Admin
        </h1>
        <p className="text-gray-600 mb-8">Welcome to the MindMeet Therapy</p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Login
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            Access both Admin and Therapist dashboards
          </p>
        </div>
      </div>
    </div>
  );
}
