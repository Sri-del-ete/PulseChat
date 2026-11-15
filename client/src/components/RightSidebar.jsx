import React from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { X, Image as ImageIcon, LogOut, Mail, Clock, ShieldCheck } from "lucide-react";

const RightSidebar = () => {
  const { selectedUser, messages, showRightSidebar, setShowRightSidebar } = useChat();
  const { onlineUsers, logout } = useAuth();

  if (!selectedUser || !showRightSidebar) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  // Extract shared media
  const sharedMedia = messages
    .filter((msg) => msg.image && msg.image.trim() !== "")
    .map((msg) => ({
      id: msg._id,
      url: msg.image,
      createdAt: msg.createdAt,
    }));

  return (
    <aside className="w-72 lg:w-80 flex flex-col h-full bg-[#0a0f1d]/95 border-l border-slate-800/80 backdrop-blur-2xl p-5 overflow-y-auto select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
          User Intelligence
        </h3>
        <button
          onClick={() => setShowRightSidebar(false)}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
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
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/25 shadow-xl shadow-emerald-950/40"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-emerald-400 font-extrabold text-2xl shadow-xl border border-slate-700">
              {selectedUser.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0f1d] ${
              isOnline ? "bg-emerald-400 online-pulse-ring" : "bg-slate-600"
            }`}
          />
        </div>

        <h2 className="text-base font-bold text-white flex items-center gap-1.5 justify-center">
          {selectedUser.fullName}
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </h2>

        <p className="text-xs text-slate-400 mt-1 max-w-[220px] leading-relaxed">
          "{selectedUser.bio || "Active on PulseChat."}"
        </p>
      </div>

      {/* Contact Quick Details */}
      <div className="mt-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Mail className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate">{selectedUser.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Status: {isOnline ? "Online Now" : "Last Seen Recently"}</span>
        </div>
      </div>

      {/* Shared Media Gallery */}
      <div className="mt-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Shared Media</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {sharedMedia.length}
          </span>
        </div>

        {sharedMedia.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-500">
            No media shared yet in this conversation.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {sharedMedia.map((item, index) => (
              <a
                key={item.id || index}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-xl overflow-hidden aspect-square border border-slate-800 bg-black/40 hover:opacity-90 transition block"
              >
                <img
                  src={item.url}
                  alt={`Shared ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Logout */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout from PulseChat
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;
