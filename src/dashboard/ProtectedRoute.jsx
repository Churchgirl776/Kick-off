import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-semibold mb-2">Access Denied 🚫</h1>
        <p className="text-gray-400 mb-6">You must be logged in to view this page.</p>
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Go to Login
        </a>
      </div>
    );

  return children;
};

export default ProtectedRoute;
