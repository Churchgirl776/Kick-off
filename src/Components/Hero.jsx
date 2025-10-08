import React from "react";

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0a0a0f] via-[#0a0a13] to-[#0a0a1a] overflow-hidden">
      {/* Background subtle light lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_60%)]"></div>
        <div className="absolute top-0 left-0 w-[150%] h-[150%] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_40px)] rotate-12"></div>
      </div>

      {/* Content */}
      <div className="z-10 px-4 sm:px-6 md:px-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
          Designing{" "}
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Products That Drive Growth & Strategy
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-8">
          I'm a Product Designer specializing in growth-driven design and strategic thinking.
          I craft digital experiences that not only look beautiful but drive measurable business results.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#work"
            className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all duration-300"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full border border-gray-500 hover:border-teal-500 hover:text-teal-400 text-gray-300 font-medium transition-all duration-300"
          >
            Let’s Connect
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
