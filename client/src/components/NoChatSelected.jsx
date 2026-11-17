import React from "react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#0e0a1f]/95 p-6 text-center select-none">
      <div className="relative mb-6">
        {/* Ambient purple glow */}
        <div className="absolute inset-0 rounded-full bg-purple-600/30 blur-2xl transform scale-150 animate-pulse" />
        
        {/* Purple Logo Bubble matching Fig 9.3 */}
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-purple-600/40 border border-purple-400/20">
          <MessageSquare className="w-12 h-12 text-white fill-white" />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
        Chat anytime, anywhere
      </h2>
      <p className="text-sm text-purple-300/70 mt-2 max-w-sm">
        Select a conversation from the sidebar or search for friends to start chatting.
      </p>
    </div>
  );
};

export default NoChatSelected;
