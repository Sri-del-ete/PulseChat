import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check auth status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const res = await axiosInstance.get("/auth/check");
        if (res.data.success) {
          setAuthUser(res.data.user);
        } else {
          setAuthUser(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check failed:", error.response?.data?.message || error.message);
        setAuthUser(null);
        localStorage.removeItem("token");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Manage socket connection when authUser changes
  useEffect(() => {
    if (!authUser?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const isRemoteHost =
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
    const socketUrl =
      isRemoteHost && rawSocketUrl && (rawSocketUrl.includes("localhost") || rawSocketUrl.includes("127.0.0.1"))
        ? ""
        : rawSocketUrl;

    // Connect socket if a valid non-localhost socket server URL is defined or running locally
    if (socketUrl || !isRemoteHost) {
      try {
        const newSocket = io(socketUrl || "http://localhost:5000", {
          query: {
            userId: authUser._id,
          },
          transports: ["websocket", "polling"],
          reconnectionAttempts: 5,
          timeout: 5000,
        });

        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
          setOnlineUsers(userIds);
        });

        newSocket.on("connect_error", (err) => {
          console.warn("Socket connection note (using fallback mode if on serverless):", err.message);
        });

        return () => {
          newSocket.disconnect();
        };
      } catch (e) {
        console.warn("Socket initialization skipped:", e.message);
      }
    }
  }, [authUser?._id]);

  // Signup
  const signup = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setAuthUser(res.data.userData);
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again.",
      };
    } finally {
      setIsSigningUp(false);
    }
  };

  // Login
  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setAuthUser(res.data.userData);
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials. Please try again.",
      };
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // Update Profile
  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res.data.success) {
        setAuthUser(res.data.user);
        return { success: true, user: res.data.user };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed.",
      };
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        token,
        isCheckingAuth,
        isSigningUp,
        isLoggingIn,
        isUpdatingProfile,
        onlineUsers,
        socket,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
