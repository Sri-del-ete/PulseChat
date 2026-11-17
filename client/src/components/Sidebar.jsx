import React, { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Search, MoreVertical, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, unseenMessages, isUsersLoading } = useChat();
  const { onlineUsers, logout, authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 md:w-88 flex flex-col h-full bg-[#130f26]/90 border-r border-purple-500/15 backdrop-blur-xl">
      {/* Top Header */}
      <div className="p-4 border-b border-purple-500/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <MessageSquare className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">QuickChat</h1>
            <p className="text-xs text-purple-300/70">Welcome, {authUser?.fullName?.split(" ")[0]}</p>
          </div>
        </div>

        {/* 3 dots menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl shadow-2xl py-2 z-50 border border-purple-500/20">
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-purple-600/20 hover:text-purple-300 transition"
              >
                <User className="w-4 h-4" />
                Profile Details
              </Link>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search User..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e1938]/80 border border-purple-500/20 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* User / Contact List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {isUsersLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-2">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            Loading contacts...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {searchQuery ? "No contacts match your search." : "No other users found."}
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
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                  isSelected
                    ? "bg-purple-600/30 border border-purple-500/40 shadow-inner"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                {/* Avatar with Status Dot */}
                <div className="relative flex-shrink-0">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/30"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-semibold text-base shadow">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Online/Offline indicator */}
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#130f26] ${
                      isOnline ? "bg-emerald-500 ring-2 ring-emerald-500/30" : "bg-gray-500"
                    }`}
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white truncate">{user.fullName}</h3>
                    {unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs capitalize font-medium ${
                      isOnline ? "text-emerald-400" : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Profile / Quick Logout Bar */}
      <div className="p-3 border-t border-purple-500/15 bg-[#100c22]/90 flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition">
          <div className="w-7 h-7 rounded-full bg-purple-700/60 flex items-center justify-center font-bold text-xs text-purple-200">
            {authUser?.fullName?.charAt(0) || "U"}
          </div>
          <span className="truncate max-w-[120px] font-medium">{authUser?.fullName}</span>
        </Link>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-xl bg-purple-700/40 hover:bg-purple-600 text-purple-200 hover:text-white transition font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
