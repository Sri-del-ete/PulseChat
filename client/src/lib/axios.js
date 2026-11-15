import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If running in browser and deployed (e.g. on Vercel)
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "/api";
  }
  return "http://localhost:5000/api";
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pulse_token") || localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
