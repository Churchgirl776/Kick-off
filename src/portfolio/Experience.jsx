import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { FaBuilding, FaCalendarAlt, FaArrowsAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Experience = () => {
  const { darkMode } = useTheme();
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "experience"), orderBy("year", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExperiences(expData);
    });
    return () => unsubscribe();
  }, []);

  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className={`flex flex-col items-center py-16 px-4 md:px-20 relative transition-all duration-500 ${
        darkMode ? "bg-[#0a0a0f] text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
      id="experience"
    >
      {/* Section Header */}
      <h1
        className={`text-center text-4xl font-light mb-12 transition-colors duration-500 ${
          darkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        Professional{" "}
        <span className="text-green-500 font-light">Experience</span>
      </h1>

      <div className="relative w-full max-w-5xl">
        {/* Vertical Line */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 md:left-10 md:translate-x-0 w-0.5 h-full opacity-50 transition-colors duration-500 ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>

        <ul className="space-y-12">
          {experiences.length === 0 ? (
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-center`}>
              Loading experiences...
            </p>
          ) : (
            experiences.map((exp) => (
              <li
                key={exp.id}
                className={`relative rounded-lg p-6 shadow-lg border transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02] ${
                  darkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
                } w-full md:w-3/4 mx-auto md:ml-20`}
              >
                {/* Glowing Timeline Dot */}
                <div
                  className={`absolute -left-6 md:-left-12 top-8 w-5 h-5 rounded-full shadow-[0_0_15px_4px_rgba(34,197,94,0.8)] border-4 transition-colors duration-500 ${
                    darkMode ? "bg-green-700 border-gray-900" : "bg-green-500 border-gray-50"
                  }`}
                ></div>

                {/* Calendar date */}
                <div
                  className={`absolute top-4 right-4 flex items-center text-sm transition-colors duration-500 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <FaCalendarAlt className="mr-2" />
                  {exp.year}
                </div>

                {/* Job Title */}
                <h3
                  className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {exp.title}
                </h3>

                {/* Company */}
                <p className={`flex items-center font-medium mb-7 transition-colors duration-500 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}>
                  <FaBuilding className="mr-2" /> {exp.company}
                </p>

                {/* Description List */}
                <ul className={`text-sm leading-relaxed space-y-2 transition-colors duration-500 ${
                  darkMode ? "text-gray-400" : "text-gray-700"
                }`}>
                  {exp.services?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FaArrowsAlt className="mt-1 mr-2 flex-shrink-0 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Footer */}
      <div className={`mt-10 text-center transition-colors duration-500 ${
        darkMode ? "text-gray-400" : "text-gray-600"
      }`}>
        Want to learn more about my professional journey? <br />
        <button
          onClick={() => scrollToSection("contact")}
          className="text-green-500 hover:underline mt-2"
        >
          Get in touch
        </button>
      </div>
    </section>
  );
};

export default Experience;
