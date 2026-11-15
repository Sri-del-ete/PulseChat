import React, { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { Zap, Search, MoreVertical, User, LogOut, Radio, CheckCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, unseenMessages, isUsersLoading } = useChat();
  const { onlineUsers, logout, authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterMode, setFilterMode] = useState("all"); // 'all' or 'online'

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMode === "online") {
      return matchesSearch && onlineUsers.includes(user._id);
    }
    return matchesSearch;
  });

  const onlineCount = users.filter((u) => onlineUsers.includes(u._id)).length;

  return (
    <aside className="w-80 md:w-92 flex flex-col h-full bg-[#0a0f1d]/90 border-r border-slate-800/80 backdrop-blur-2xl select-none">
      {/* Top Brand Bar */}
      <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Zap className="w-5 h-5 text-black fill-black" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0f1d] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold tracking-tight text-white">PulseChat</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {onlineCount} {onlineCount === 1 ? "contact" : "contacts"} online
            </p>
          </div>
        </div>

        {/* 3-Dots Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 pulse-card rounded-2xl shadow-2xl py-2 z-50 border border-slate-700/60 animate-in fade-in zoom-in-95 duration-150">
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-300 transition"
              >
                <User className="w-4 h-4 text-emerald-400" />
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-3 space-y-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition"
          />
        </div>

        {/* Tabs: All / Online Only */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <button
            onClick={() => setFilterMode("all")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              filterMode === "all"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            All ({users.length})
          </button>
          <button
            onClick={() => setFilterMode("online")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              filterMode === "online"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Online ({onlineCount})
          </button>
        </div>
      </div>

      {/* User / Contact List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {isUsersLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm gap-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Syncing contacts...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            {searchQuery ? "No contacts match your query." : "No contacts available."}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            const unreadCount = unseenMessages[user._id] || 0;

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-left group ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 shadow-lg shadow-emerald-950/40"
                    : "hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                {/* Avatar with Status Ring */}
                <div className="relative flex-shrink-0">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-emerald-500/40 transition"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-emerald-400 font-bold text-base shadow border border-slate-700">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Online/Offline status dot */}
                  <span
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0a0f1d] ${
                      isOnline ? "bg-emerald-400 online-pulse-ring" : "bg-slate-600"
                    }`}
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-emerald-300 transition">
                      {user.fullName}
                    </h3>
                    {unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/20">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {user.bio || (isOnline ? "Active now" : "Offline")}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Current User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#090d19]/90 flex items-center justify-between">
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/50 transition group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-xs text-black shadow">
            {authUser?.fullName?.charAt(0) || "U"}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate max-w-[110px]">
              {authUser?.fullName}
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </p>
          </div>
        </Link>

        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition font-medium flex items-center gap-1.5"
          title="Logout from PulseChat"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
