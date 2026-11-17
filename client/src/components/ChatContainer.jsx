import React, { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, Loader2 } from "lucide-react";

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
    <div className="flex-1 flex flex-col h-full bg-[#0e0a1f]/95 overflow-hidden">
      <ChatHeader />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {isMessagesLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-purple-300/70 text-sm">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-3">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-base font-semibold text-white">Start the conversation</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Say hello to {selectedUser?.fullName}! Send a greeting or share an image.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === authUser?._id;

            return (
              <div
                key={message._id || Math.random()}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[65%] rounded-2xl p-3.5 shadow-lg ${
                    isMe
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-purple-600/20"
                      : "bg-[#1f1a3a] text-gray-100 rounded-bl-none border border-purple-500/15"
                  }`}
                >
                  {/* Image attachment if exists */}
                  {message.image && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/10 max-h-80">
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="w-full h-auto object-cover hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Text Message */}
                  {message.text && (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                      {message.text}
                    </p>
                  )}

                  {/* Timestamp & Seen status */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                      isMe ? "text-purple-200/80" : "text-gray-400"
                    }`}
                  >
                    <span>{formatMessageTime(message.createdAt)}</span>
                    {isMe && (
                      <span>
                        {message.seen ? (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-300" title="Seen" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-purple-200" title="Sent" />
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
