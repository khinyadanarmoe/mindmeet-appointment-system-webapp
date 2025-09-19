"use client";

import Link from "next/link";
import Image from "next/image";
import { assets } from "../assets/assets";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <Image
          src={assets.logo}
          alt="MindMeet Logo"
          width={200}
          height={200}
          className="mx-auto mb-4"
        />

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
