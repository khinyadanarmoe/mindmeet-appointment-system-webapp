import { Inter } from "next/font/google";
import "./globals.css";
import AdminContextProvider from "../contexts/AdminContext.jsx";
import TherapistContextProvider from "../contexts/TherapistContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "MindMeet Admin",
  description: "Admin panel for MindMeet therapy platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminContextProvider>
          <TherapistContextProvider>
            {children}
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
      </body>
    </html>
  );
}
