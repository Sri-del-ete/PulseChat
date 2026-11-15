import React from "react";
import { Zap, Radio, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#070b15]/95 p-6 text-center select-none relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -bottom-10 -right-10" />

      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/30">
          <Zap className="w-12 h-12 text-black fill-black animate-bounce" />
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-4 border-[#070b15] online-pulse-ring" />
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
        Welcome to PulseChat
      </h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
        Select a conversation from the sidebar or search your contacts to begin real-time messaging with instant delivery.
      </p>

      {/* Feature Badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-lg">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-emerald-400">
          <Radio className="w-3.5 h-3.5" /> Live Presence Pulse
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" /> High-Res Cloud Media
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-purple-400">
          <ShieldCheck className="w-3.5 h-3.5" /> JWT Secure Sessions
        </span>
      </div>
    </div>
  );
};

export default NoChatSelected;
