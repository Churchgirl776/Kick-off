// Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for redirection
import { getAuth, signOut } from "firebase/auth"; // ✅ Firebase logout
import {
  FaProjectDiagram,
  FaTools,
  FaAward,
  FaBriefcase,
  FaShareAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({
  activeSection,
  setActiveSection,
  theme,
  toggleTheme,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [autosave, setAutosave] = useState(true);
  const [fontStyle, setFontStyle] = useState("Inter");

  const navigate = useNavigate(); // ✅ Hook for navigation
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Sign out from Firebase
      navigate("/"); // ✅ Redirect to portfolio homepage
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const sections = [
    { id: "overview", label: "Overview", icon: <FaProjectDiagram /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
    { id: "skills", label: "Skills", icon: <FaTools /> },
    { id: "awards", label: "Awards", icon: <FaAward /> },
    { id: "experience", label: "Experience", icon: <FaBriefcase /> },
    { id: "social", label: "Social", icon: <FaShareAlt /> },
  ];

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-200 p-2 rounded bg-gray-200 hover:bg-gray-300 shadow-md"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-zinc-950 shadow-lg z-40 transform transition-transform duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64`}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-center py-6 border-b border-gray-200 text-gray-50">
            Admin Panel
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-green-100 hover:text-green-700 ${
                  activeSection === section.id
                    ? "bg-green-500 text-white"
                    : "text-gray-200"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Settings + Logout Section */}
        <div className="px-4 py-6 border-t border-gray-200 text-gray-50">
          {/* Settings Toggle */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-zinc-800 transition"
            onClick={() => setShowSettings(!showSettings)}
          >
            <FaCog />
            <span className="font-medium">Settings</span>
          </div>

          {showSettings && (
            <div className="mt-3 space-y-3">
              {/* Autosave Toggle */}
              <div className="flex items-center justify-between">
                <span>Autosave</span>
                <input
                  type="checkbox"
                  checked={autosave}
                  onChange={() => setAutosave(!autosave)}
                  className="cursor-pointer"
                />
              </div>

              {/* Theme Toggle */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={toggleTheme}
              >
                <span>Theme</span>
                <span>
                  {theme === "light" ? (
                    <FaSun className="text-yellow-400" />
                  ) : (
                    <FaMoon className="text-gray-700" />
                  )}
                </span>
              </div>

              {/* Font Styling Dropdown */}
              <div className="flex items-center justify-between">
                <span>Font</span>
                <select
                  value={fontStyle}
                  onChange={(e) => setFontStyle(e.target.value)}
                  className="bg-gray-100 text-gray-900 rounded p-1"
                >
                  <option value="Inter">Inter</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Monospace">Monospace</option>
                </select>
              </div>
            </div>
          )}

          {/* ✅ Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full justify-center transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
