import React from "react";
import { useTheme } from "../context/ThemeContext";

function Hero() {
  const { darkMode } = useTheme();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className={`relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 ${
        darkMode ? "bg-[#0a0a0f] text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1665652475985-37e285aeff53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')",
        }}
      ></div>

      {/* Overlay for contrast */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          darkMode ? "bg-black/70" : "bg-white/60"
        }`}
      ></div>

      {/* Content */}
      <div className="z-10 px-4 sm:px-6 md:px-10 max-w-3xl">
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6 transition-all duration-500 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Designing{" "}
          <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
            Products That Drive Growth & Strategy
          </span>
        </h1>

        <p
          className={`text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 transition-all duration-500 ${
            darkMode ? "text-gray-300" : "text-gray-900"
          }`}
        >
          I'm a Product Designer specializing in growth-driven design and
          strategic thinking. I craft digital experiences that not only look
          beautiful but drive measurable business results.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection("projects")}
            className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all duration-300"
          >
            View My Work
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className={`px-6 py-3 rounded-full border transition-all duration-300 ${
              darkMode
                ? "border-gray-600 text-gray-200 hover:border-teal-400 hover:text-teal-400"
                : "border-gray-700 text-gray-900 hover:border-teal-900 hover:text-teal-500"
            }`}
          >
            Let’s Connect
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
