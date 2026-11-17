import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Mail, Lock, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    const res = await login(formData);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-ambient flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl glass-panel shadow-2xl overflow-hidden border border-purple-500/20">
        {/* Left Branding Panel (Matching Fig 9.1) */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-purple-900/40 via-purple-950/20 to-transparent border-r border-purple-500/10 text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-purple-600/40 mb-6 border border-purple-400/20 animate-pulse">
            <MessageSquare className="w-12 h-12 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">QuickChat</h1>
          <p className="text-sm text-purple-300/80 mt-3 max-w-xs leading-relaxed">
            Connect instantly with friends, share media, and experience real-time messaging.
          </p>
        </div>

        {/* Right Form Card */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#130f26]/80">
          <div className="md:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white fill-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">QuickChat</h2>
          </div>

          <h2 className="text-2xl font-bold text-white">Login</h2>
          <p className="text-xs text-purple-300/70 mt-1">Sign in to continue your conversations</p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold underline ml-1">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
