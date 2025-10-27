import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // import theme hook

const About = () => {
  const { darkMode } = useTheme();

  return (
    <section
      id="about"
      className={`relative py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-center gap-10 transition-all duration-500 ${
        darkMode ? "bg-[#0a0a0f] text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Left Side - Image */}
      <motion.div
        className="relative flex-shrink-0"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Background Blocks */}
        <div
          className={`absolute -top-6 -left-6 w-32 h-32 rounded-lg opacity-70 transition-all duration-500 ${
            darkMode ? "bg-teal-950" : "bg-teal-100"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 right-0 w-32 h-32 rounded-lg opacity-70 transition-all duration-500 ${
            darkMode ? "bg-indigo-950" : "bg-indigo-100"
          }`}
        ></div>

        {/* Profile Image */}
        <img
          src="https://coursebrowser.dce.harvard.edu/wp-content/uploads/2024/08/learning-design-323x182.jpg"
          alt="Profile"
          className={`relative z-10 w-72 h-72 md:w-96 md:h-96 object-cover rounded-lg shadow-lg border transition-all duration-500 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        />

        {/* Floating Counter */}
        <div
          className={`absolute -bottom-4 -right-4 px-6 py-4 rounded-lg shadow-md border flex flex-col items-center justify-center z-20 transition-all duration-500 ${
            darkMode ? "bg-black/80 border-gray-600" : "bg-white border-gray-300"
          }`}
        >
          <span
            className={`text-2xl font-bold transition-all duration-500 ${
              darkMode ? "text-green-500" : "text-teal-600"
            }`}
          >
            50+
          </span>
          <span
            className={`block text-sm font-light transition-all duration-500 ${
              darkMode ? "text-gray-200" : "text-gray-600"
            }`}
          >
            Projects Completed
          </span>
        </div>
      </motion.div>

      {/* Right Side - Text Content */}
      <motion.div
        className="flex-1 max-w-xl space-y-6"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9 }}
      >
        <h2
          className={`text-3xl md:text-4xl font-bold transition-all duration-500 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Crafting Digital Experiences That{" "}
          <span className={`transition-all duration-500 ${
            darkMode ? "text-green-400" : "text-teal-600"
          }`}>
            Transform Businesses
          </span>
        </h2>

        <p
          className={`leading-relaxed transition-all duration-500 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          With over 5 years of experience in product design and growth strategy, I believe that
          great design is not just about aesthetics — it’s about solving real problems and
          driving meaningful business outcomes.
        </p>

        <p
          className={`leading-relaxed transition-all duration-500 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          I specialize in bridging the gap between user needs and business goals, creating
          products that users love and that drive growth. My approach combines data-driven
          insights with creative design thinking to deliver exceptional results.
        </p>

        {/* Feature Cards */}
        <div className="space-y-4">
          {[ 
            { iconColorLight: "green-100", iconColorDark: "green-950", title: "Design Philosophy", desc: "Every pixel should serve a purpose, every interaction should feel intuitive.", svgColorLight: "green-700" },
            { iconColorLight: "blue-100", iconColorDark: "blue-950", title: "Growth Mindset", desc: "Focus on metrics that matter — optimize for user value and business impact.", svgColorLight: "blue-700" },
            { iconColorLight: "purple-100", iconColorDark: "purple-950", title: "Collaboration", desc: "Great products are built by great teams working together.", svgColorLight: "purple-700" }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
                darkMode ? "bg-black border-gray-700" : "bg-gray-100 border-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`p-3 rounded-lg transition-all duration-500 ${
                  darkMode ? `bg-${card.iconColorDark}` : `bg-${card.iconColorLight}`
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transition-all duration-500 ${
                    darkMode ? "text-white" : `text-${card.svgColorLight}`
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      idx === 0
                        ? "M9 12h6m2 0a2 2 0 01-2 2H9a2 2 0 01-2-2m6 0V9m0 6v3m0-6V6"
                        : idx === 1
                        ? "M11 12h2m-1-6v6m0 0v6m-4-6h8"
                        : "M16 8a6 6 0 11-12 0 6 6 0 0112 0z"
                    }
                  />
                </svg>
              </div>
              <div>
                <h4
                  className={`font-semibold transition-all duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {card.title}
                </h4>
                <p
                  className={`text-sm transition-all duration-500 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
