import { Inter } from "next/font/google";
import "./globals.css";
import AppContextProvider from "../contexts/AppContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { assets } from "../assets/assets.js";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "MindMeet - Mental Health Therapy Platform",
  description: "Connect with professional therapists and improve your mental health",
  icons: {
    icon: assets.title_logo, 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} p-4`}>
        <AppContextProvider>
          <Navbar />
          {children}
          <Footer />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AppContextProvider>
      </body>
    </html>
  );
}
