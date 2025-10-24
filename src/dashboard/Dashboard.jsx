// components/Dashboard.jsx
import React, { useState, useEffect, useCallback, createContext } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectsManager from "./Projects";
import SkillsManager from "./Skills";
import AwardsManager from "./Awards";
import ExperienceManager from "./Experience";
import SocialMediaManager from "./SocialMedia";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// Theme context to share theme across all child components
export const ThemeContext = createContext();

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    awards: 0,
    experience: 0,
    social: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Protect dashboard route
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/");
    });
    return unsubscribe;
  }, [navigate]);

  // Apply theme globally
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // 🔹 Real-time stats from Firestore
  useEffect(() => {
    setLoading(true);

    const unsubscribers = [
      onSnapshot(collection(db, "projects"), (snap) =>
        setStats((prev) => ({ ...prev, projects: snap.size }))
      ),
      onSnapshot(collection(db, "skills"), (snap) =>
        setStats((prev) => ({ ...prev, skills: snap.size }))
      ),
      onSnapshot(collection(db, "awards"), (snap) =>
        setStats((prev) => ({ ...prev, awards: snap.size }))
      ),
      onSnapshot(collection(db, "experience"), (snap) =>
        setStats((prev) => ({ ...prev, experience: snap.size }))
      ),
      onSnapshot(collection(db, "socialMedia"), (snap) =>
        setStats((prev) => ({ ...prev, social: snap.size }))
      ),
    ];

    setLoading(false);

    return () => unsubscribers.forEach((unsub) => unsub && unsub());
  }, []);

  // Manual refresh (optional)
  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const [projects, skills, awards, experience, social] = await Promise.all(
        ["projects", "skills", "awards", "experience", "socialMedia"].map(
          (c) => getDocs(collection(db, c))
        )
      );
      setStats({
        projects: projects.size,
        skills: skills.size,
        awards: awards.size,
        experience: experience.size,
        social: social.size,
      });
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [navigate]);

  // Render child managers with theme & onUpdate
  const renderContent = () => {
    const commonProps = { theme, toggleTheme, onUpdate: fetchStats };
    switch (activeSection) {
      case "projects":
        return <ProjectsManager {...commonProps} />;
      case "skills":
        return <SkillsManager {...commonProps} />;
      case "awards":
        return <AwardsManager {...commonProps} />;
      case "experience":
        return <ExperienceManager {...commonProps} />;
      case "social":
        return <SocialMediaManager {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`min-h-screen flex transition-colors duration-500 ${
          theme === "dark"
            ? "bg-zinc-950 text-gray-100"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static lg:translate-x-0 top-0 left-0 z-40 h-full w-64 transition-transform duration-300`}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            theme={theme}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
        </div>

        {/* Main dashboard content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-5" : "ml-0"
          } p-4 sm:p-6 md:p-8`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-3 md:mb-0">
              Admin Dashboard
            </h1>

            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {loading ? (
                <p className="text-center col-span-full">Loading stats...</p>
              ) : (
                <>
                  {[
                    { title: "Projects", color: "text-blue-600", key: "projects" },
                    { title: "Skills", color: "text-green-600", key: "skills" },
                    { title: "Awards", color: "text-purple-600", key: "awards" },
                    {
                      title: "Experience",
                      color: "text-orange-600",
                      key: "experience",
                    },
                    { title: "Socials", color: "text-yellow-600", key: "social" },
                  ].map(({ title, color, key }) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition ${
                        theme === "dark"
                          ? "bg-zinc-900 border-zinc-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-2">{title}</h3>
                      <p className={`text-2xl font-bold ${color}`}>{stats[key]}</p>
                      <p className="text-sm opacity-75">
                        {title === "Projects"
                          ? "Total projects"
                          : title === "Skills"
                          ? "Technical skills"
                          : title === "Awards"
                          ? "Achievements"
                          : title === "Experience"
                          ? "Work experience"
                          : "Social media handles"}
                      </p>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Active Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default Dashboard;
