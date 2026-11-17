import React from "react";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {
  const { selectedUser } = useChat();

  return (
    <div className="h-screen w-screen bg-ambient flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Outer Floating Glass Container matching Documentation Figures */}
      <div className="w-full h-full max-w-7xl max-h-[920px] rounded-3xl overflow-hidden glass-panel shadow-2xl flex relative border border-purple-500/20">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Central Chat Area or Empty Welcome State */}
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}

        {/* Right Details Sidebar */}
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
