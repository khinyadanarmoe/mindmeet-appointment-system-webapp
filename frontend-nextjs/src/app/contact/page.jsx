"use client";

import React from "react";
import { assets } from "../assets/assets";
import Image from "next/image";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center py-16"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
          Contact Us
        </h2>

        <div className="rounded-xl shadow-md border bg-white flex flex-col md:flex-row overflow-hidden">
          {/* Left: image */}
          <div className="md:w-1/2 w-full h-64 md:h-auto relative">
            <Image
              src={assets.about_image}
              alt="Contact Us"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Right: Contact Information */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">
              We're here to help
            </h3>
            <p className="text-gray-600 mb-6">
              Have questions or need support? Get in touch with our team — we'll
              respond as soon as possible.
            </p>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                <div className="space-y-2">
                  <p className="text-sm flex items-center">
                    <a
                      href="mailto:support@mindmeet.com?subject=Mental Health Support Inquiry&body=Hello MindMeet team,%0D%0A%0D%0AI would like to inquire about..."
                      className="hover:text-purple-900 transition-colors duration-200"
                    >
                      ✉️ support@mindmeet.com
                    </a>
                  </p>
                  <p className="text-sm flex items-center">
                    <a
                      href="tel:+1234567890"
                      className="hover:text-purple-900 transition-colors duration-200"
                    >
                      📞 +123 456 7890
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* apply job at mindmeet */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">
                Interested in joining our team?
              </h3>
              <p className="text-gray-600 mb-4">
                We're always looking for passionate individuals to join us. Send
                your resume and cover letter to us.
              </p>
              <button
                onClick={() =>
                  (window.location.href =
                    "mailto:support@mindmeet.com?subject=Job Application&body=Hello MindMeet team,%0D%0A%0D%0AI am interested in applying for a position at MindMeet. Please find my resume and cover letter attached.%0D%0A%0D%0AThank you for considering my application.%0D%0A%0D%0ABest regards,")
                }
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
