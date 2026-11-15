import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { Loader2 } from "lucide-react";

function App() {
  const { authUser, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen bg-[#070a12] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300 tracking-wide">
          Connecting to PulseChat...
        </p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/signup"
        element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/profile"
        element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
