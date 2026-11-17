import React from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, Info } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, showRightSidebar, setShowRightSidebar } = useChat();
  const { onlineUsers } = useAuth();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-6 py-4 border-b border-purple-500/15 flex items-center justify-between bg-[#15112d]/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Back button for mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition md:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="relative">
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-semibold shadow">
              {selectedUser.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#15112d] ${
              isOnline ? "bg-emerald-500 ring-2 ring-emerald-500/30" : "bg-gray-500"
            }`}
          />
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {selectedUser.fullName}
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
              }`}
            />
          </h2>
          <p className="text-xs text-purple-300/70 font-medium">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Info / Toggle Drawer button */}
      <button
        onClick={() => setShowRightSidebar((prev) => !prev)}
        className={`p-2 rounded-xl transition ${
          showRightSidebar
            ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
            : "hover:bg-white/10 text-gray-300 hover:text-white"
        }`}
        title="View details & media"
      >
        <Info className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
