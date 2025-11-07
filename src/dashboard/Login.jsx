// /src/dashboard/Login.jsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Check if user already exists
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch {
        // If not, create a new admin account
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Save admin info in Firestore
        await setDoc(doc(db, "admins", userCredential.user.uid), {
          fullName,
          description,
          email,
          createdAt: new Date(),
          workspace: [], // start with blank workspace
        });
      }

      const userDoc = await getDoc(doc(db, "admins", userCredential.user.uid));

      // Redirect logic:
      if (userDoc.exists()) {
        const adminData = userDoc.data();

        if (adminData.workspace && adminData.workspace.length > 0) {
          // Existing admin with stored data → load dashboard with their collection
          navigate("/admin");
        } else {
          // New admin → redirect to a clean workspace view
          navigate("/admin?new=true");
        }
      } else {
        // Fallback if doc not found
        navigate("/admin?new=true");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gray-900 text-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md z-50 animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-green-400 flex items-center gap-1"
        >
          <FaArrowLeft /> <span className="hidden sm:inline">Back</span>
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Admin Login / Signup
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 p-2 sm:p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Short Description */}
          <div className="relative">
            <input
              type="text"
              placeholder="Short Description"
              className="w-full pl-10 p-2 sm:p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-2 sm:p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 p-2 sm:p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 sm:py-3 rounded-lg shadow-lg shadow-green-400/50 font-semibold transition-all duration-300"
          >
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
