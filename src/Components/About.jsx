// AboutSection.jsx
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="bg-black-1/4 backdrop-opacity-95 text-white py-16 px-16 md:px-16 flex flex-col md:flex-row items-center md:items-center justify-center gap-10">
  {/* Left Side - Image */}
<motion.div
  className="relative flex-shrink-0"
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Background Colored Divs */}
  <div className="absolute -top-6 rotate-12 -left-6 w-100 h-90 bg-teal-950 opacity-70"></div>
  <div className="absolute bottom-0 right-0 w-100 h-90 bg-indigo-950 opacity-70"></div>

  {/* Image on Top */}
  <img
    src="https://coursebrowser.dce.harvard.edu/wp-content/uploads/2024/08/learning-design-323x182.jpg"
    alt="Profile"
    className="relative z-10 w-100 h-100 md:w-96 md:h-96 object-cover rounded-lg shadow-lime-300g shadow-lg"
  />

  {/* Floating Project Counter */}
  <div className="absolute -bottom-4 -right-4 bg-black backdrop-opacity-95 px-6 py-6 shadow-lime-300g font-semibold border-white border-1 rounded-lg flex flex-col items-center justify-center z-20">
    <span className="text-2xl text-center text-green-600">50+</span>
    <span className="block text-sm text-amber-50 font-light">
      Projects Completed
    </span>
  </div>
</motion.div>



      {/* Right Side - Content */}
      <motion.div
        className="flex-1 max-w-xl space-y-6"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Crafting Digital Experiences That{" "}
          <span className="text-green-600">Transform Businesses</span>
        </h2>

        <p className="text-gray-300 leading-relaxed">
          With over 5 years of experience in product design and growth strategy, I
          believe that great design is not just about aesthetics—it’s about solving
          real problems and driving meaningful business outcomes.
        </p>

        <p className="text-gray-300 leading-relaxed">
          I specialize in bridging the gap between user needs and business goals,
          creating products that users love and that drive growth. My approach combines
          data-driven insights with creative design thinking to deliver exceptional results.
        </p>

        {/* Feature Cards */}
        <div className="space-y-4">
          <motion.div
            className="flex items-center gap-4 p-4 bg-black rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-green-500 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m2 0a2 2 0 01-2 2H9a2 2 0 01-2-2m6 0V9m0 6v3m0-6V6"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white">Design Philosophy</h4>
              <p className="text-gray-400 text-sm">
                Every pixel should serve a purpose, every interaction should feel intuitive
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 p-4 bg-black rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-blue-600 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 12h2m-1-6v6m0 0v6m-4-6h8"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white">Growth Mindset</h4>
              <p className="text-gray-400 text-sm">
                Focus on metrics that matter, optimize for user value and business impact
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 p-4 bg-black rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-purple-600 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white">Collaboration</h4>
              <p className="text-gray-400 text-sm">
                Great products are built by great teams working together
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
