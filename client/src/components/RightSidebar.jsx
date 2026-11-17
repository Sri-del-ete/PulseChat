import React from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { X, Image as ImageIcon, LogOut } from "lucide-react";

const RightSidebar = () => {
  const { selectedUser, messages, showRightSidebar, setShowRightSidebar } = useChat();
  const { onlineUsers, logout } = useAuth();

  if (!selectedUser || !showRightSidebar) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  // Extract all media images shared in this conversation
  const sharedMedia = messages
    .filter((msg) => msg.image && msg.image.trim() !== "")
    .map((msg) => ({
      id: msg._id,
      url: msg.image,
      createdAt: msg.createdAt,
    }));

  return (
    <aside className="w-72 lg:w-80 flex flex-col h-full bg-[#130f26]/95 border-l border-purple-500/15 backdrop-blur-xl p-5 overflow-y-auto">
      {/* Top Close bar */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
        <h3 className="text-sm font-bold text-white tracking-wide">Contact Details</h3>
        <button
          onClick={() => setShowRightSidebar(false)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User Profile Card */}
      <div className="flex flex-col items-center text-center mt-5">
        <div className="relative mb-3">
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.fullName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-600/30 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
              {selectedUser.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#130f26] ${
              isOnline ? "bg-emerald-500 ring-2 ring-emerald-500/30" : "bg-gray-500"
            }`}
          />
        </div>

        <h2 className="text-base font-bold text-white flex items-center gap-2">
          {selectedUser.fullName}
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
            }`}
          />
        </h2>

        <p className="text-xs text-purple-300 mt-1 max-w-[220px] italic">
          "{selectedUser.bio || "Hey there! I am using QuickChat."}"
        </p>
      </div>

      {/* Shared Media Section */}
      <div className="mt-8 flex-1">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <span>Media ({sharedMedia.length})</span>
        </div>

        {sharedMedia.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#1b1636]/60 border border-purple-500/10 text-center text-xs text-gray-400">
            No media shared in this conversation yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {sharedMedia.map((item, index) => (
              <a
                key={item.id || index}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-xl overflow-hidden aspect-square border border-purple-500/20 bg-black/40 hover:opacity-90 transition block"
              >
                <img
                  src={item.url}
                  alt={`Shared ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-purple-500/15">
        <button
          onClick={logout}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:opacity-95 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;
