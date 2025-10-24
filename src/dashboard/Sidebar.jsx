// components/Sidebar.jsx
import React from "react";
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
  handleLogout,
  isOpen,
  setIsOpen,
}) => {
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
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded shadow-md transition-colors ${
            theme === "dark"
              ? "bg-zinc-800 text-gray-100 hover:bg-zinc-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`h-full flex flex-col justify-between transition-all duration-300 ${
          theme === "dark"
            ? "bg-zinc-900 text-gray-100 border-r border-zinc-800"
            : "bg-white text-gray-800 border-r border-gray-200"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col h-full">
          {/* Title */}
          <div
            className={`text-2xl font-bold text-center py-6 border-b ${
              theme === "dark" ? "border-zinc-700" : "border-gray-200"
            }`}
          >
            Admin Panel
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  if (window.innerWidth < 1024) setIsOpen(false); // close on mobile
                }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeSection === section.id
                    ? theme === "dark"
                      ? "bg-green-600 text-white"
                      : "bg-green-500 text-white"
                    : theme === "dark"
                    ? "hover:bg-zinc-800"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section (Settings + Logout) */}
        <div
          className={`px-4 py-6 border-t ${
            theme === "dark" ? "border-zinc-700" : "border-gray-200"
          }`}
        >
          {/* Theme Toggle */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
              theme === "dark"
                ? "hover:bg-zinc-800"
                : "hover:bg-gray-100 text-gray-800"
            }`}
            onClick={toggleTheme}
          >
            <span className="font-medium">Theme</span>
            {theme === "light" ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-blue-400" />
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full justify-center transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
