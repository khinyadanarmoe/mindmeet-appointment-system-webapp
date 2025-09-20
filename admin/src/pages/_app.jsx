"use client";

import AdminContextProvider from "../contexts/AdminContext.jsx";
import TherapistContextProvider from "../contexts/TherapistContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../app/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AdminContextProvider>
      <TherapistContextProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </TherapistContextProvider>
    </AdminContextProvider>
  );
}