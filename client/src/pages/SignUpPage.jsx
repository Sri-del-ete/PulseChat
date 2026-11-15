import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, User, Mail, Lock, Sparkles, Loader2, ShieldCheck } from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
    agreeTerms: true,
  });
  const [error, setError] = useState("");
  const { signup, isSigningUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeTerms) {
      setError("Please accept the terms of use and privacy policy to continue.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const res = await signup({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      bio: formData.bio || "Active on PulseChat! ⚡",
    });

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message || "Registration failed. Please try again.");
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
              Join the future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                live conversations.
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Create an account in seconds. Seamlessly sync messages across tabs, devices, and browser sessions with instant notifications.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-normal">
              Your profile and credentials are encrypted using industry-standard JWT & bcrypt cryptography.
            </p>
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

          <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
          <p className="text-xs text-slate-400 mt-1">Get started with your free PulseChat workspace</p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl pulse-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="alex@domain.com"
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
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl pulse-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio (Optional)</label>
              <div className="relative">
                <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Building cool things in tech ⚡"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl pulse-input text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-300 cursor-pointer">
                I agree to the terms of service and privacy policy.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
