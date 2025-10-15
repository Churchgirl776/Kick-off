import React from "react";
import { motion } from "framer-motion";
import {
  FaTrophy,
  FaMedal,
  FaAward,
  FaStar,
  FaCrown,
  FaGem,
  FaSmile,
  FaProjectDiagram,
  FaClock,
} from "react-icons/fa";

const awards = [
  {
    id: 1,
    icon: <FaTrophy size={25} color="white" />,
    title: "Best Innovation Award",
    description:
      "Recognized for outstanding innovation and creative problem-solving in product development.",
    year: "2023",
  },
  {
    id: 2,
    icon: <FaMedal size={25} color="white" />,
    title: "Excellence in Service",
    description:
      "Awarded for delivering exceptional service and exceeding client expectations.",
    year: "2022",
  },
  {
    id: 3,
    icon: <FaAward size={25} color="white" />,
    title: "Leadership Recognition",
    description:
      "Honored for strong leadership and inspiring team growth across all departments.",
    year: "2021",
  },
  {
    id: 4,
    icon: <FaStar size={25} color="white" />,
    title: "Employee of the Year",
    description:
      "Awarded for consistent performance, reliability, and excellence throughout the year.",
    year: "2020",
  },
  {
    id: 5,
    icon: <FaCrown size={25} color="white" />,
    title: "Top Performer",
    description:
      "Recognized as the top performer for outstanding achievements and results-driven efforts.",
    year: "2019",
  },
  {
    id: 6,
    icon: <FaGem size={25} color="white" />,
    title: "Outstanding Achievement",
    description:
      "Received for exceptional accomplishments and lasting contributions to the organization.",
    year: "2018",
  },
];

const badges = [
  {
    id: 1,
    title: "Awards Won",
    value: "24+",
  },
  {
    id: 2,
    title: "Projects Completed",
    value: "150+",
  },
  {
    id: 3,
    title: "Customer Satisfaction",
    value: "98%",
  },
  {
    id: 4,
    title: "Years of Experience",
    value: "10+",
  },
];

const Awards = () => {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-6 sm:px-10 lg:px-20 text-gray-200">
      {/* Header */}
      <h2 className="text-5xl sm:text-4xl font-light text-center text-white mb-10">
        Recognition & <span className="text-green-500">Award</span>
      </h2>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {awards.map((award) => (
          <motion.div
            key={award.id}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-black border-1 border-zinc-700 shadow-md rounded-lg p-6 flex flex-col items-start transition-all duration-100"
          >
            {/* Icon and Year */}
            <div className="flex flex-col items-center mr-4 mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-700 p-2 rounded-md flex items-center justify-center shadow-md">
                {award.icon}
              </div>
              <span className="text-gray-200 bg-zinc-800 rounded-full text-sm font-semibold mt-2 py-1 px-3">
                {award.year}
              </span>
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-2xl font-semibold text-white transition-colors duration-300 hover:text-green-400">
                {award.title}
              </h3>
              <p className="text-gray-400 mt-2 text-sm">{award.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-12 text-center max-w-3xl mx-auto">
        <p className="text-gray-400 text-base font-stretch-100% sm:text-lg leading-relaxed">
          "Our journey is built on innovation, passion, and a relentless pursuit
          of excellence. Each award represents a milestone in our commitment to
          delivering exceptional value, empowering creativity, and setting
          benchmarks across industries."
        </p>
      </div>

      {/* Owner Section */}
      <div className="mt-10 flex justify-center">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-right space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="bg-gradient-to-bl from-teal-600 to-blue-400 text-black font-bold text-xl w-16 h-16 flex items-center justify-center rounded-full shadow-md">
            JD
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold text-start">John Doe</h4>
            <p className="text-gray-400 text-sm">
              Founder & CEO, BrightTech Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className=" p-6 flex flex-col items-center justify-center"
          >
            {badge.icon}
            <h5 className="text-3xl font-bold text-green-700 mt-3">{badge.value}</h5>
            <p className="text-gray-400 text-sm mt-1">{badge.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Awards;
