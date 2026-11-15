import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Camera, ChevronLeft, Loader2, Sparkles, User, ShieldCheck } from "lucide-react";
import { readFileAsDataURL } from "../lib/utils";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuth();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "Active on PulseChat! ⚡");
  const [selectedImage, setSelectedImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage({ type: "error", text: "Please select an image file." });
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setSelectedImage(dataUrl);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    const updateData = {
      fullName: fullName.trim(),
      bio: bio.trim(),
    };

    if (selectedImage) {
      updateData.profilePic = selectedImage;
    }

    const res = await updateProfile(updateData);
    if (res.success) {
      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => {
        setStatusMessage({ type: "", text: "" });
      }, 3000);
    } else {
      setStatusMessage({ type: "error", text: res.message || "Failed to update profile." });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-ambient-pulse flex items-center justify-center p-4">
      {/* Outer Card */}
      <div className="w-full max-w-xl rounded-3xl pulse-panel shadow-2xl p-8 relative border border-slate-800">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Chat
        </button>

        <div className="text-center mt-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Profile Settings</h2>
          <p className="text-xs text-slate-400 mt-1">Manage your identity and appearance on PulseChat</p>
        </div>

        {statusMessage.text && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs text-center border animate-in fade-in ${
              statusMessage.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          {/* Avatar Upload Container */}
          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change avatar"
            >
              <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-2xl bg-slate-800 flex items-center justify-center">
                {selectedImage || authUser?.profilePic ? (
                  <img
                    src={selectedImage || authUser?.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-extrabold text-3xl">
                    {authUser?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition duration-200">
                <Camera className="w-6 h-6 text-white" />
                <span className="text-[10px] text-white mt-1 font-semibold">Update</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 font-semibold"
            >
              <Camera className="w-3.5 h-3.5" />
              Upload new photo
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl pulse-input text-sm text-white placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Biography</label>
            <div className="relative">
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Active on PulseChat! ⚡"
                className="w-full p-3.5 rounded-xl pulse-input text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                Updating Profile...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
