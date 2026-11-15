import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Mail, Lock, Loader2, ShieldCheck, Radio, Sparkles } from "lucide-react";

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
      setError("Please fill in both email and password.");
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
    <div className="min-h-screen w-screen bg-ambient-pulse flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl pulse-panel shadow-2xl overflow-hidden border border-slate-800">
        {/* Left Branding Showcase */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-transparent border-r border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">PulseChat</span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-white mt-12 tracking-tight leading-tight">
              Real-time messaging, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                reimagined.
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Connect instantly with team members and friends with zero latency, active presence pulses, and rich media sharing.
            </p>
          </div>

          {/* Value Props */}
          <div className="space-y-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <span>Live WebSocket presence & instant read receipts</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Cloudinary-powered high-speed image delivery</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Encrypted token sessions & Bcrypt authentication</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#090e1c]/90">
          <div className="md:hidden flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <h2 className="text-xl font-bold text-white">PulseChat</h2>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your credentials to access your conversations</p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl pulse-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl pulse-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
