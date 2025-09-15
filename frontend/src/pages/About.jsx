import React from "react";
import doc1 from "../assets/doc1.png";
import doc2 from "../assets/doc2.png";

const About = () => {
  return (
    <div
      id="about"
      className="bg-gradient-to-br from-purple-50 to-blue-50 flex  justify-center py-16 relative overflow-hidden"
    >
      {/* Left Therapist Image */}
      <div className="absolute bottom-0 left-4 top-1/2 transform -translate-y-1/2 z-10 -ml-16 md:-ml-20">
        <img
          src={doc1}
          alt="Mental health professional"
          className="w-64 h-64 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] opacity-90"
        />
      </div>

      {/* Right Therapist Image */}
      <div className="absolute bottom-0 right-4 top-1/2 transform -translate-y-1/2 z-10 -mr-16 md:-mr-20">
        <img
          src={doc2}
          alt="Mental health professional"
          className="w-64 h-64 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] opacity-90"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
          About Us
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          At <span className="font-semibold text-purple-800">MindMeet</span>, we
          believe that mental health is just as important as physical health.
          Our platform connects individuals with trusted therapists, counselors,
          and mental health professionals for convenient, confidential, and
          supportive online sessions.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-purple-800">
              Our Mission
            </h3>
            <p className="mt-3 text-gray-600 text-sm">
              To make mental health care accessible for everyone, anytime,
              anywhere — by providing a safe space to connect with professionals
              online.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-purple-800">
              Our Vision
            </h3>
            <p className="mt-3 text-gray-600 text-sm">
              A world where seeking mental health support is normalized and
              every individual feels empowered to take care of their emotional
              well-being.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-purple-800">
              Our Values
            </h3>
            <p className="mt-3 text-gray-600 text-sm">
              Compassion, confidentiality, and community drive everything we do,
              ensuring you always feel supported and respected on your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
