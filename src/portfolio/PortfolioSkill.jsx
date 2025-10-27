import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useTheme } from "../context/ThemeContext";

const PortfolioSkill = () => {
  const { darkMode } = useTheme(); // get current theme
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section
      id="skills"
      className={`flex flex-col justify-center items-center py-10 md:py-12 px-6 md:px-12 mb-10 transition-all duration-500 ${
        darkMode ? "bg-[#0a0a0f] text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="w-full max-w-7xl">
        {/* Header */}
        <h2
          className={`text-3xl md:text-4xl font-semibold text-center mb-3 transition-colors duration-500 ${
            darkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          Skills <span className="text-emerald-400">& Expertise</span>
        </h2>
        <p
          className={`text-center mb-12 max-w-2xl transition-colors duration-500 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          A comprehensive toolkit for creating products that drive growth and
          deliver exceptional user experiences.
        </p>

        {/* Skill Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`group rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                darkMode
                  ? "bg-black border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Icon + Name Row */}
              <div className="flex items-center space-x-4 mb-3 transition-transform duration-300 group-hover:-translate-y-1">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-lg transition-colors duration-500 ${
                    darkMode
                      ? "bg-gradient-to-br from-emerald-900 to-cyan-900"
                      : "bg-gradient-to-br from-emerald-500 to-cyan-500"
                  }`}
                >
                  {skill.icon ? (
                    skill.icon.startsWith("http") ? (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <span
                        className={`text-2xl ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {skill.icon}
                      </span>
                    )
                  ) : (
                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                  )}
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold transition-colors duration-300 group-hover:text-emerald-400 ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {skill.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              {skill.description && (
                <p
                  className={`text-sm mt-1 line-clamp-3 group-hover:line-clamp-none transition-all text-left ${
                    darkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  {skill.description}
                </p>
              )}

              {/* Technologies Pills */}
              {skill.technologies && skill.technologies.length > 0 && (
                <div className="flex flex-wrap justify-start gap-2 mt-4">
                  {skill.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200 ${
                        darkMode
                          ? "bg-gray-800 text-gray-300 border-gray-700 hover:border-emerald-400 hover:text-emerald-300"
                          : "bg-gray-100 text-gray-800 border-gray-300 hover:border-emerald-400 hover:text-emerald-600"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSkill;
