import React from "react";
import { motion } from "framer-motion";
import {
  FaPalette,
  FaPenNib,
  FaChartBar,
  FaSearch,
  FaChartLine,
  FaUserFriends,
  FaCode,
} from "react-icons/fa";
import { FaMobileScreen } from "react-icons/fa6";

const skillData = [
  { icon: <FaPalette />, title: "UI/UX", description: "Creating intuitive and visually appealing interfaces that enhance user experience and drive engagement." },
  { icon: <FaChartLine />, title: "Product Strategy", description: "Aligning design decisions with business goals and market opportunities to maximize product success." },
  { icon: <FaChartBar />, title: "Growth Design", description: "Designing and implementing features that drive user acquisition, retention, and revenue growth." },
  { icon: <FaSearch />, title: "User Research", description: "Conducting user research to understand user needs, behaviors, and motivations to inform design decisions." },
  { icon: <FaPenNib />, title: "Wireframe", description: "Creating low-fidelity wireframes to visualize the structure and layout of a product or feature." },
  { icon: <FaUserFriends />, title: "Team Leadership", description: "Leading cross-functional teams to deliver high-quality design solutions that meet business and user needs." },
  { icon: <FaMobileScreen />, title: "Mobile Design", description: "Designing mobile apps that provide a seamless and engaging user experience across various devices and platforms." },
  { icon: <FaCode />, title: "Design Systems", description: "Creating and maintaining design systems to ensure consistency and efficiency across products and teams." },
];

const toolData = [
  { title: "Figma" },
  { title: "Sketch" },
  { title: "Adobe Creative Suite" },
  { title: "Principle" },
  { title: "Framer" },
  { title: "Hotjar" },
  { title: "Google Analytics" },
  { title: "Mixpanel" },
  { title: "Amplitude" },
  { title: "A/B Testing" },
];

const Skills = () => {
  return (
    <section className="bg-transparent text-white py-16 px-4 sm:px-6 md:px-10 lg:px-20">
      {/* Heading */}
      <h1 className="text-center text-3xl md:text-4xl font-light mb-4">
        <span>Skills & </span>
        <span className="text-green-700 font-medium">Expertise</span>
      </h1>
      <p className="text-center text-gray-300 md:text-lg font-extralight mb-12 max-w-3xl mx-auto">
        A comprehensive toolkit for creating products that drive growth and
        deliver exceptional user experiences.
      </p>

      {/* Skills Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 w-full max-w-7xl mx-auto">
        {skillData.map((skill, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gray-900 p-6 rounded-2xl shadow-md text-center hover:shadow-green-500/30 transition-all duration-300"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-3xl md:text-4xl mb-4 text-gray-300 bg-gradient-to-br from-teal-700 to-blue-700/10 rounded-lg p-3 w-14 h-14 flex items-center justify-center mx-auto"
            >
              {skill.icon}
            </motion.div>
            <h3 className="text-lg md:text-xl text-gray-200 font-semibold mb-2 hover:text-green-700 transition-colors duration-300">
              {skill.title}
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
              {skill.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tools & Technologies Section */}
      <h2 className="text-center text-base md:text-xl font-light mb-8 text-gray-300">
        Tools & Technologies
      </h2>

      {/* Compact, responsive badges */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto">
        {toolData.map((tool, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="border border-transparent hover:border-green-600 bg-gray-800 rounded-lg md:rounded-xl py-2 px-2 sm:py-2 sm:px-3 md:py-3 md:px-4 text-center transition-all duration-300 flex items-center justify-center"
          >
            <h3 className="text-[10px] sm:text-xs md:text-sm font-light text-gray-200 truncate">
              {tool.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
