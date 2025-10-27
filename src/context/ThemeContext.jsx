import React, { createContext, useState, useEffect, useContext } from "react";

// Portfolio-specific context
const PortfolioThemeContext = createContext();

export const PortfolioThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return saved === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("portfolio-theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Apply the portfolio-dark class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("portfolio-dark");
    } else {
      document.documentElement.classList.remove("portfolio-dark");
    }
  }, [darkMode]);

  return (
    <PortfolioThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </PortfolioThemeContext.Provider>
  );
};

// Hook for easy usage
export const useTheme = () => useContext(PortfolioThemeContext);
