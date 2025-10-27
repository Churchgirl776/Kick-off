// PortfolioAwards.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import * as Icons from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const badges = [
  { id: 1, title: "Awards Won", value: "24+" },
  { id: 2, title: "Projects Completed", value: "150+" },
  { id: 3, title: "Customer Satisfaction", value: "98%" },
  { id: 4, title: "Years of Experience", value: "10+" },
];

const PortfolioAwards = () => {
  const { darkMode } = useTheme();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const awardsRef = collection(db, "awards");
    const q = query(awardsRef, orderBy("year", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const awardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAwards(awardsData);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load awards.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading)
    return <p className="text-center py-10 transition-colors duration-500 text-gray-400">Loading awards...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className={darkMode ? "bg-[#0a0a0f] text-gray-200 transition-colors duration-500" : "bg-gray-50 text-gray-900 transition-colors duration-500"}>
      <section
        className="py-20 px-6 md:px-16 flex justify-center"
        id="awards"
      >
        <div className="max-w-7xl w-full">
          {/* Section Title */}
          <motion.h2
            className={`text-4xl md:text-5xl font-bold mb-12 text-center leading-tight transition-colors duration-500 ${darkMode ? "text-gray-200" : "text-gray-900"}`}
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Recognition &{" "}
            <span className="bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
              Awards
            </span>
          </motion.h2>

          {/* Awards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {awards.map((award) => {
              const IconComponent = award.icon && Icons[award.icon];
              return (
                <motion.div
                  key={award.id}
                  className={`p-6 w-full max-w-sm rounded-2xl shadow-lg border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-green-600/30 ${
                    darkMode ? "bg-black/70 border-gray-700" : "bg-white/90 border-gray-200"
                  }`}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mb-4 shadow-md text-white text-3xl">
                    {IconComponent ? <IconComponent /> : "🏆"}
                  </div>

                  {/* Year Pill */}
                  <div className={`inline-block px-3 py-1 rounded-full mb-3 text-xs transition-colors duration-500 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"}`}>
                    {award.year}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-semibold mb-2 text-left transition-colors duration-300 hover:text-green-400 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {award.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-left leading-relaxed transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                    {award.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <motion.div
        className="max-w-4xl mx-auto text-center mt-14 px-6"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className={`text-lg leading-relaxed italic transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
          “Our journey is built on innovation, passion, and a relentless pursuit
          of excellence. Each award symbolizes our dedication to creating
          impactful, meaningful work that drives change and inspires growth.”
        </p>
      </motion.div>

      {/* Owner Section */}
      <motion.div
        className="mt-12 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-blue-400 text-black font-bold text-xl w-16 h-16 flex items-center justify-center rounded-full shadow-md">
            JD
          </div>
          <div>
            <h4 className={`text-lg font-semibold transition-colors duration-500 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              John Doe
            </h4>
            <p className={`text-sm transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Founder & CEO, BrightTech Solutions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats / Badges Section */}
      <motion.div
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center max-w-5xl mx-auto pb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`p-6 flex flex-col items-center justify-center rounded-xl border shadow-inner transition-colors duration-500 ${
              darkMode ? "bg-gray-900/60 border-gray-700" : "bg-gray-100/70 border-gray-200"
            }`}
          >
            <h5 className="text-3xl font-bold text-green-500 mt-1">{badge.value}</h5>
            <p className={`text-sm mt-2 transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              {badge.title}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PortfolioAwards;
