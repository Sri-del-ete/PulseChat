import React, { useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { Image, Send, X, Loader2, Smile } from "lucide-react";
import { readFileAsDataURL } from "../lib/utils";

const QUICK_EMOJIS = ["👋", "👍", "🔥", "❤️", "✨", "🎉"];

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const { sendMessage, isSendingMessage } = useChat();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    } catch (err) {
      console.error("Error reading image:", err);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setShowEmojiPicker(false);
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
    <div className="p-3.5 bg-[#0a0f1d]/90 border-t border-slate-800/80 backdrop-blur-xl relative">
      {/* Quick Emoji Bar */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-6 p-2 rounded-2xl pulse-card shadow-2xl flex items-center gap-2 border border-slate-700/80 animate-in fade-in slide-in-from-bottom-2">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              className="text-lg hover:scale-125 transition p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview Bar */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl group">
            <img src={imagePreview} alt="Upload Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/80 hover:bg-rose-600 text-white rounded-full p-1 transition"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-400">Image attached</p>
            <p className="text-[10px] text-slate-400">Ready to send via PulseChat CDN</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="flex-1 flex items-center bg-slate-900/90 rounded-2xl border border-slate-800/90 px-3.5 py-2.5 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 transition mr-2"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type a message or paste an image..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          {/* Attach Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-1.5 rounded-xl transition ${
              imagePreview
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
            }`}
            title="Attach image"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSendingMessage || (!text.trim() && !imagePreview)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-black font-bold transition shadow-lg ${
            !text.trim() && !imagePreview
              ? "bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed"
              : "bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-95 shadow-emerald-500/25 active:scale-95"
          }`}
        >
          {isSendingMessage ? (
            <Loader2 className="w-5 h-5 animate-spin text-black" />
          ) : (
            <Send className="w-5 h-5 fill-black" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
