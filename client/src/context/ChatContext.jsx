import { createContext, useContext, useEffect, useState, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const { socket, authUser } = useAuth();
  const selectedUserRef = useRef(selectedUser);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Fetch users for sidebar
  const getUsers = async (silent = false) => {
    if (!silent) setIsUsersLoading(true);
    try {
      const res = await axiosInstance.get("/messages/users");
      if (res.data.success) {
        setUsers(res.data.users);
        if (res.data.unseenMessages) {
          setUnseenMessages(res.data.unseenMessages);
        }
      }
    } catch (error) {
      if (!silent) {
        console.error("Failed to load users:", error.response?.data?.message || error.message);
      }
    } finally {
      if (!silent) setIsUsersLoading(false);
    }
  };

  // Fetch messages between current user and selected user
  const getMessages = async (userId, silent = false) => {
    if (!userId) return;
    if (!silent) setIsMessagesLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      if (!silent) {
        console.error("Failed to load messages:", error.response?.data?.message || error.message);
      }
    } finally {
      if (!silent) setIsMessagesLoading(false);
    }
  };

  // Mark messages from a user as seen
  const markMessagesSeen = async (userId) => {
    if (!userId) return;
    try {
      await axiosInstance.put(`/messages/mark/${userId}`);
      setUnseenMessages((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to mark messages as seen:", error);
    }
  };

  // Select a user to chat with
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (user?._id) {
      getMessages(user._id);
      markMessagesSeen(user._id);
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    if (!selectedUser?._id) return { success: false };
    setIsSendingMessage(true);
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.newMessage]);
        return { success: true, message: res.data.newMessage };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      console.error("Failed to send message:", error.response?.data?.message || error.message);
      return { success: false, message: error.message };
    } finally {
      setIsSendingMessage(false);
    }
  };

  // WebSockets real-time listener (when connected)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentSelected = selectedUserRef.current;
      if (
        currentSelected &&
        (newMessage.senderId === currentSelected._id || newMessage.receiverId === currentSelected._id)
      ) {
        setMessages((prev) => {
          // Avoid duplicate message if already added locally
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
        if (newMessage.senderId === currentSelected._id) {
          markMessagesSeen(currentSelected._id);
        }
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    const handleMessagesSeen = ({ seenBy }) => {
      const currentSelected = selectedUserRef.current;
      if (currentSelected && currentSelected._id === seenBy) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === authUser?._id ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, authUser?._id]);

  // Vercel Serverless / Fallback Polling (Sync every 3.5s if socket is not active)
  useEffect(() => {
    if (!authUser?._id) return;

    const interval = setInterval(() => {
      const isSocketActive = socket && socket.connected;
      if (!isSocketActive) {
        // Poll for new messages in active chat
        if (selectedUserRef.current?._id) {
          getMessages(selectedUserRef.current._id, true);
        }
        // Poll users for unseen badge updates
        getUsers(true);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [authUser?._id, socket]);

  return (
    <ChatContext.Provider
      value={{
        users,
        selectedUser,
        messages,
        isUsersLoading,
        isMessagesLoading,
        isSendingMessage,
        unseenMessages,
        showRightSidebar,
        setShowRightSidebar,
        getUsers,
        getMessages,
        setSelectedUser: handleSelectUser,
        sendMessage,
        markMessagesSeen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
