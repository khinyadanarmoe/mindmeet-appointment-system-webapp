import React from "react";

const Footer = () => {
  return (
    <footer className="bg-fuchsia-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">MindMeet</h2>
          <p className="mt-3 text-sm text-gray-300">
            Connecting you with trusted mental health professionals dedicated to
            guiding you through life’s challenges. At MindMeet, we believe that
            every conversation can be the first step toward healing, growth, and
            resilience. Because your mind deserves the same care and attention
            as your body — today, tomorrow, and always.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <a href="/about" className="hover:text-pink-300">
                About Us
              </a>
            </li>
            <li>
              <a href="/professionals" className="hover:text-pink-300">
                Professionals
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-pink-300">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-300 flex items-center">
              <a
                href="mailto:support@mindmeet.com?subject=Mental Health Support Inquiry&body=Hello MindMeet team,%0D%0A%0D%0AI would like to inquire about..."
                className="hover:text-pink-300 transition-colors duration-200"
              >
                support@mindmeet.com
              </a>
            </p>
            <p className="text-sm text-gray-300 flex items-center">
              <a
                href="tel:+1234567890"
                className="hover:text-pink-300 transition-colors duration-200"
              >
                +123 456 7890
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} MindMeet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
