import React from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, Info, Phone, Video, ShieldCheck } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, showRightSidebar, setShowRightSidebar } = useChat();
  const { onlineUsers } = useAuth();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-[#0a0f1d]/85 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* Back button for mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition md:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* User Avatar with Ring */}
        <div className="relative">
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.fullName}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-emerald-400 font-bold shadow border border-slate-700">
              {selectedUser.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0f1d] ${
              isOnline ? "bg-emerald-400 online-pulse-ring" : "bg-slate-600"
            }`}
          />
        </div>

        {/* User Details */}
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-white tracking-tight">{selectedUser.fullName}</h2>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified Member" />
          </div>
          <p className="text-[11px] font-medium flex items-center gap-1 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span className={isOnline ? "text-emerald-400" : "text-slate-400"}>
              {isOnline ? "Active now" : "Offline"}
            </span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => alert(`Simulating voice call with ${selectedUser.fullName}...`)}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition hidden sm:flex"
          title="Voice Call"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          onClick={() => alert(`Simulating video call with ${selectedUser.fullName}...`)}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition hidden sm:flex"
          title="Video Call"
        >
          <Video className="w-4 h-4" />
        </button>

        {/* Toggle Right Details Drawer */}
        <button
          onClick={() => setShowRightSidebar((prev) => !prev)}
          className={`p-2 rounded-xl transition ${
            showRightSidebar
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
          title="View profile & shared media"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
