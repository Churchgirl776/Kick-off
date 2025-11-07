import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import * as Icons from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { onAuthStateChanged } from "firebase/auth";

const PortfolioAwards = () => {
  const { darkMode } = useTheme();
  const [awards, setAwards] = useState([]);
  const [badges, setBadges] = useState([
    { id: 1, title: "Awards Won", value: "0" },
    { id: 2, title: "Projects Completed", value: "0" },
    { id: 3, title: "Customer Satisfaction", value: "0%" },
    { id: 4, title: "Years of Experience", value: "0+" },
  ]);
  const [owner, setOwner] = useState({
    fullName: "John Doe",
    initials: "JD",
    description: "Founder & CEO, BrightTech Solutions",
    color: "from-teal-500 to-blue-400",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time awards listener
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

  // Real-time badges logic
  useEffect(() => {
    const projectsRef = collection(db, "projects");
    const awardsRef = collection(db, "awards");
    const expRef = collection(db, "experience");

    const unsubProjects = onSnapshot(projectsRef, (snap) => {
      setBadges((prev) =>
        prev.map((b) =>
          b.title === "Projects Completed" ? { ...b, value: `${snap.size}+` } : b
        )
      );
    });

    const unsubAwards = onSnapshot(awardsRef, (snap) => {
      setBadges((prev) =>
        prev.map((b) =>
          b.title === "Awards Won" ? { ...b, value: `${snap.size}+` } : b
        )
      );
    });

    const unsubExperience = onSnapshot(expRef, (snap) => {
      if (snap.empty) return;
      const years = snap.docs
        .map((doc) => parseInt(doc.data().year))
        .filter((y) => !isNaN(y));

      if (years.length > 0) {
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        const currentYear = new Date().getFullYear();
        const experienceYears = Math.max(currentYear - minYear + 1, maxYear - minYear + 1);

        setBadges((prev) =>
          prev.map((b) =>
            b.title === "Years of Experience"
              ? { ...b, value: `${experienceYears}+` }
              : b
          )
        );
      }
    });

    // Optional: constant satisfaction
    setBadges((prev) =>
      prev.map((b) =>
        b.title === "Customer Satisfaction" ? { ...b, value: "100%" } : b
      )
    );

    return () => {
      unsubProjects();
      unsubAwards();
      unsubExperience();
    };
  }, []);

  // ✅ Real-time owner listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const ownerRef = doc(db, "admins", user.uid);
      const unsubscribeOwner = onSnapshot(ownerRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fullName = data.fullName || "John Doe";
          const initials = fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          const colors = [
            "from-teal-500 to-blue-400",
            "from-purple-500 to-pink-500",
            "from-yellow-400 to-orange-500",
            "from-green-400 to-teal-400",
          ];
          const colorIndex =
            fullName
              .split("")
              .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

          setOwner({
            fullName,
            initials,
            description: data.description || "Founder & CEO, BrightTech Solutions",
            color: colors[colorIndex],
          });
        }
      });

      return () => unsubscribeOwner();
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 transition-colors duration-500 text-gray-400">
        Loading awards...
      </p>
    );
  if (error)
    return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div
      className={
        darkMode
          ? "bg-[#0a0a0f] text-gray-200 transition-colors duration-500"
          : "bg-gray-50 text-gray-900 transition-colors duration-500"
      }
    >
      {/* Awards Section */}
      <section className="py-20 px-6 md:px-16 flex justify-center" id="awards">
        <div className="max-w-7xl w-full">
          <motion.h2
            className={`text-4xl md:text-5xl font-bold mb-12 text-center leading-tight transition-colors duration-500 ${
              darkMode ? "text-gray-200" : "text-gray-900"
            }`}
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Recognition &{" "}
            <span className="bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
              Awards
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {awards.map((award) => {
              const IconComponent = award.icon && Icons[award.icon];
              return (
                <motion.div
                  key={award.id}
                  className={`p-6 w-full h-72 max-w-sm rounded-2xl shadow-lg border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-green-800/30 ${
                    darkMode ? "bg-black/70 border-gray-700" : "bg-white/90 border-gray-200"
                  }`}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mb-4 shadow-md text-white text-3xl">
                    {IconComponent ? <IconComponent /> : "🏆"}
                  </div>

                  <div
                    className={`inline-block px-3 py-1 rounded-full mb-3 text-xs transition-colors duration-500 ${
                      darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {award.year}
                  </div>

                  <h3
                    className={`text-xl font-semibold mb-2 text-left transition-colors duration-300 hover:text-green-400 ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {award.title}
                  </h3>

                  <p
                    className={`text-left leading-relaxed transition-colors duration-500 ${
                      darkMode ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {award.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary */}
      <motion.div
        className="max-w-4xl mx-auto text-center mt-14 px-6"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p
          className={`text-lg leading-relaxed italic transition-colors duration-500 ${
            darkMode ? "text-gray-400" : "text-gray-700"
          }`}
        >
          “Our journey is built on innovation, passion, and a relentless pursuit
          of excellence...”
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
          <div
            className={`bg-gradient-to-br ${owner.color} text-black font-bold text-xl w-16 h-16 flex items-center justify-center rounded-full shadow-md`}
          >
            {owner.initials}
          </div>
          <div>
            <h4
              className={`text-lg font-semibold transition-colors duration-500 ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {owner.fullName}
            </h4>
            <p
              className={`text-sm transition-colors duration-500 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {owner.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Real-time Stats / Badges */}
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
