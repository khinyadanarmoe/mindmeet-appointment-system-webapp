import React, { useContext, useState, useEffect } from "react";
import { TherapistContext } from "../../contexts/TherapistContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const TherapistProfile = () => {
  const {
    dToken,
    getTherapistProfile,
    therapistProfile,
    setTherapistProfile,
    updateTherapistProfile,
    backendUrl,
  } = useContext(TherapistContext);

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (dToken) {
      getTherapistProfile();
    }
  }, [dToken]);

  useEffect(() => {
    if (therapistProfile) {
      setFormData({
        about: therapistProfile.about || "",
        zoomLink: therapistProfile.zoomLink || "",
        available: therapistProfile.available || false,
      });
    }
  }, [therapistProfile]);

  const updateProfile = async () => {
    // No required field validation needed for editable fields
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("about", formData.about);
      form.append("zoomLink", formData.zoomLink);
      form.append("available", formData.available);

      if (image) form.append("image", image);

      const success = await updateTherapistProfile(form);
      if (success) {
        setIsEditing(false);
        setImage(null);
        await getTherapistProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  if (!therapistProfile) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center min-h-screen flex-1">
      <div className="max-w-5xl px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900  mb-10">
          My Profile
        </h2>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Profile Image */}
            <div className="lg:w-1/3 bg-gradient-to-br from-purple-100 to-blue-100 p-8 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={
                      formData.image ||
                      therapistProfile.image ||
                      assets.doctor_icon
                    }
                    alt="Profile"
                    className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover shadow-2xl border-4 border-white"
                  />
                  {isEditing && (
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                    >
                      <svg
                        viewBox="-12 -12 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.9888 4.28491L19.6405 2.93089C18.4045 1.6897 16.4944 1.6897 15.2584 2.93089L13.0112 5.30042L18.7416 11.055L21.1011 8.68547C21.6629 8.1213 22 7.33145 22 6.54161C22 5.75176 21.5506 4.84908 20.9888 4.28491Z"
                          fill="#f0f2ff"
                        />
                        <path
                          d="M16.2697 10.9422L11.7753 6.42877L2.89888 15.3427C2.33708 15.9069 2 16.6968 2 17.5994V21.0973C2 21.5487 2.33708 22 2.89888 22H6.49438C7.2809 22 8.06742 21.6615 8.74157 21.0973L17.618 12.1834L16.2697 10.9422Z"
                          fill="#f0f2ff"
                        />
                      </svg>
                    </label>
                  )}

                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {therapistProfile.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {therapistProfile.speciality}
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      therapistProfile.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {therapistProfile.available ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Therapist Data */}
            <div className="lg:w-2/3 p-8 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.name}
                      </p>
                    </div>
                  </div>

                  {/* Speciality (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Speciality
                    </label>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.speciality}
                      </p>
                    </div>
                  </div>

                  {/* Degree (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Degree
                    </label>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.degree}
                      </p>
                    </div>
                  </div>

                  {/* Experience (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Experience
                    </label>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-800 font-medium">
                        {therapistProfile.experience || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Fees (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Consultation Fees
                    </label>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <p className="text-gray-800 font-medium">
                        ${therapistProfile.fees || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Zoom Link (Editable) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Zoom Meeting Link
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.zoomLink}
                        onChange={(e) =>
                          setFormData({ ...formData, zoomLink: e.target.value })
                        }
                        placeholder="https://zoom.us/j/..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-800 font-medium">
                          {therapistProfile.zoomLink ? (
                            <a
                              href={therapistProfile.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 hover:underline"
                            >
                              {therapistProfile.zoomLink}
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Availability (Editable) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Availability Status
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.available}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            available: e.target.value === "true",
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-gray-800 font-medium">
                          {therapistProfile.available
                            ? "Available"
                            : "Not Available"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* About (Editable) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">
                      About / Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.about}
                        onChange={(e) =>
                          setFormData({ ...formData, about: e.target.value })
                        }
                        rows={4}
                        placeholder="Write a brief description about yourself and your therapeutic approach..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <svg
                          className="w-5 h-5 text-gray-400 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-gray-800 font-medium">
                          {therapistProfile.about || "No description provided"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button at Bottom Right */}
              <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
                {isEditing ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImage(null);
                        getTherapistProfile(); // Reset to original data
                      }}
                      disabled={isLoading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateProfile}
                      disabled={isLoading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;
