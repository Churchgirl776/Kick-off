// components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    awards: 0,
    experience: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Secure dashboard: redirect if not logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/");
    });
    return unsubscribe;
  }, [navigate]);

  // Real-time listeners for stats (auto-updates when collections change)
  useEffect(() => {
    setLoading(true);
    const collections = ["projects", "skills", "awards", "experience"];

    const unsubscribers = collections.map((colName) => {
      const colRef = collection(db, colName);
      return onSnapshot(
        colRef,
        (snap) => {
          setStats((prev) => ({ ...prev, [colName]: snap.size }));
          setLoading(false);
        },
        (err) => {
          console.error(`Realtime error listening to ${colName}:`, err);
          setLoading(false);
        }
      );
    });

    // cleanup
    return () => unsubscribers.forEach((u) => u && u());
  }, []);

  // Manual refresh (uses getDocs)
  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const [projectsSnap, skillsSnap, awardsSnap, experienceSnap] =
        await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "skills")),
          getDocs(collection(db, "awards")),
          getDocs(collection(db, "experience")),
        ]);

      setStats({
        projects: projectsSnap.size,
        skills: skillsSnap.size,
        awards: awardsSnap.size,
        experience: experienceSnap.size,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
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
      console.error("Error signing out:", err);
    }
  }, [navigate]);

  // Render section content
  const renderContent = () => {
    switch (activeSection) {
      case "projects":
        return <ProjectsManager onUpdate={fetchStats} />;
      case "skills":
        return <SkillsManager onUpdate={fetchStats} />;
      case "awards":
        return <AwardsManager onUpdate={fetchStats} />;
      case "experience":
        return <ExperienceManager onUpdate={fetchStats} />;
      case "social":
        return <SocialMediaManager onUpdate={fetchStats} />;
      default:
        return null;
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout} // ✅ pass logout handler to Sidebar
      />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-zinc-300 min-h-screen overflow-auto ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 md:mb-0">
            Admin Dashboard
          </h1>

          {/* ✅ Only Refresh button remains */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={refreshing}
              aria-label="Refresh stats"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {loading ? (
              <p className="text-center col-span-full">Loading stats...</p>
            ) : (
              <>
                <motion.div
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Projects
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.projects}</p>
                  <p className="text-gray-500 text-sm">Total projects</p>
                </motion.div>

                <motion.div
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Skills
                  </h3>
                  <p className="text-2xl font-bold text-green-600">{stats.skills}</p>
                  <p className="text-gray-500 text-sm">Technical skills</p>
                </motion.div>

                <motion.div
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Awards
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">{stats.awards}</p>
                  <p className="text-gray-500 text-sm">Achievements</p>
                </motion.div>

                <motion.div
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Experience
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">{stats.experience}</p>
                  <p className="text-gray-500 text-sm">Work experience</p>
                </motion.div>
              </>
            )}
          </div>
        )}

        {/* Section Content with AnimatePresence */}
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
      </div>
    </div>
  );
};

export default Dashboard;
