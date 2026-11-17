import React, { useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { Image, Send, X, Loader2 } from "lucide-react";
import { readFileAsDataURL } from "../lib/utils";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessage, isSendingMessage } = useChat();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const messageData = {
      text: text.trim(),
      image: imagePreview,
    };

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    await sendMessage(messageData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="p-4 bg-[#14102b]/90 border-t border-purple-500/15 backdrop-blur-md">
      {/* Image Preview if selected */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-xl group">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-purple-300">Ready to send image</p>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="flex-1 flex items-center bg-[#1d173c]/80 rounded-2xl border border-purple-500/25 px-4 py-2.5 focus-within:ring-2 focus-within:ring-purple-500/60 focus-within:border-transparent transition">
          <input
            type="text"
            placeholder="Send a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
          />

          {/* Attach image button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-1.5 rounded-xl transition ${
              imagePreview
                ? "text-purple-400 bg-purple-500/20"
                : "text-gray-400 hover:text-purple-300 hover:bg-white/5"
            }`}
            title="Attach Image"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={isSendingMessage || (!text.trim() && !imagePreview)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white transition shadow-lg ${
            !text.trim() && !imagePreview
              ? "bg-purple-800/40 opacity-50 cursor-not-allowed"
              : "bg-gradient-to-tr from-purple-600 to-indigo-500 hover:opacity-95 shadow-purple-600/30 active:scale-95"
          }`}
        >
          {isSendingMessage ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5 fill-white" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
