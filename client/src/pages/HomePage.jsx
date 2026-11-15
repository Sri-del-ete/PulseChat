import React from "react";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {
  const { selectedUser } = useChat();

  return (
    <div className="h-screen w-screen bg-ambient-pulse flex items-center justify-center p-0 sm:p-3 md:p-5 overflow-hidden">
      {/* Outer Sleek Floating Glass Frame */}
      <div className="w-full h-full max-w-[1500px] sm:rounded-3xl overflow-hidden pulse-panel shadow-2xl flex relative border-0 sm:border border-slate-800/80">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Central Chat Interface or Welcome View */}
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}

        {/* Right Info Drawer */}
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
