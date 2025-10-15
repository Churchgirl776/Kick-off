// components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectsManager from "./Projects";
import SkillsManager from "./Skills";
import AwardsManager from "./Awards";
import ExperienceManager from "./Experience";
import SocialMediaManager from "./SocialMedia";
import { collection, getDocs } from "firebase/firestore";
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

  // Secure dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/"); // redirect if not logged in
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Fetch stats from Firestore
  const fetchStats = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        return <SocialMediaManager />;
      default:
        return null;
    }
  };

  // Animated card variant
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
      />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 md:mb-0">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
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
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.projects}
                  </p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {stats.skills}
                  </p>
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
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.awards}
                  </p>
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
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.experience}
                  </p>
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
