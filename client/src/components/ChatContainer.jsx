import React, { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, Loader2, Sparkles } from "lucide-react";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useChat();
  const { authUser } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070b15]/95 overflow-hidden">
      <ChatHeader />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {isMessagesLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2.5 text-slate-400 text-sm">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            Decrypting conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400 shadow-xl shadow-emerald-950/50">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Start chatting with {selectedUser?.fullName}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Send a greeting or attach media to ignite this conversation on PulseChat.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === authUser?._id;

            return (
              <div
                key={message._id || Math.random()}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-1 duration-200`}
              >
                <div
                  className={`max-w-[82%] sm:max-w-[65%] rounded-2xl p-3.5 shadow-lg ${
                    isMe
                      ? "bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white rounded-br-none shadow-emerald-950/30"
                      : "bg-[#11182a] text-slate-100 rounded-bl-none border border-slate-800/90 shadow-slate-950/50"
                  }`}
                >
                  {/* Image Attachment */}
                  {message.image && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/10 max-h-80 bg-black/40">
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="w-full h-auto object-cover hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Message Content */}
                  {message.text && (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed break-words font-normal">
                      {message.text}
                    </p>
                  )}

                  {/* Timestamp & Seen Status */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                      isMe ? "text-emerald-100/80" : "text-slate-400"
                    }`}
                  >
                    <span>{formatMessageTime(message.createdAt)}</span>
                    {isMe && (
                      <span>
                        {message.seen ? (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-300" title="Seen" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-emerald-200" title="Delivered" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
