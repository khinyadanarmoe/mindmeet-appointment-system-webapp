"use client";

import Sidebar from "../../components/Sidebar.jsx";

export default function TherapistLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
