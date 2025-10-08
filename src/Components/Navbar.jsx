import React, { useState, useEffect } from "react";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    // Load saved theme from localStorage
    return localStorage.getItem("theme") === "dark";
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply or remove dark class on html element
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-xl font-semibold text-gray-900 dark:text-white">
          Portfolio
        </div>

        {/* Center Nav Links */}
        <ul
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-[#0a0a0f] md:bg-transparent md:dark:bg-transparent flex flex-col md:flex-row md:space-x-8 items-center md:items-center text-center text-gray-800 dark:text-gray-300 font-medium transition-all duration-300 ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible md:visible md:opacity-100"
          }`}
        >
          {["Home", "About", "Skills", "Experience", "Projects", "Awards", "Contact"].map(
            (item) => (
              <li
                key={item}
                className="py-3 md:py-0 hover:text-teal-400 dark:hover:text-teal-400 transition-colors duration-300"
              >
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </li>
            )
          )}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-700 dark:text-gray-300 text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="text-gray-800 dark:text-gray-300 text-2xl md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;