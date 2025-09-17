"use client";
import React from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center py-16"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
          About Us
        </h2>

        <div className="rounded-xl shadow-md border bg-white flex flex-col md:flex-row overflow-hidden">
          {/* Left: image */}
          <div className="md:w-1/2 w-full h-64 md:h-auto relative">
            <Image
              src={assets.about_bg_img}
              alt="About Us"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Right: About Information */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <p className="text-gray-600 mb-6">
              At <span className="font-semibold text-purple-800">MindMeet</span>
              , we believe that mental health is just as important as physical
              health. Our platform connects individuals with trusted therapists,
              counselors, and mental health professionals for convenient,
              confidential, and supportive online sessions.
            </p>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-3">Our Mission</h3>
                <p className="text-sm">
                  To make mental health care accessible for everyone, anytime,
                  anywhere — by providing a safe space to connect with
                  professionals online.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Our Vision</h3>
                <p className="text-sm">
                  A world where seeking mental health support is normalized and
                  every individual feels empowered to take care of their
                  emotional well-being.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Our Values</h3>
                <p className="text-sm">
                  Compassion, confidentiality, and community drive everything we
                  do, ensuring you always feel supported and respected on your
                  journey.
                </p>
              </div>
            </div>

            {/* Learn more about our team */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Developed By</h3>
              <p className="text-gray-600 mb-4">
                Khin Yadanar Moe - 6612128, Natassasi Nithinoranan - 6610918,
                Aye Myat Myat Mon - 6611944
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
