import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden" id="home">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1665652475985-37e285aeff53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTg3NzMzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="z-10 px-4 sm:px-6 md:px-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
          Designing{" "}
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Products That Drive Growth & Strategy
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-8">
          I'm a Product Designer specializing in growth-driven design and strategic thinking.
          I craft digital experiences that not only look beautiful but drive measurable business results.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("*projects")}
            className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all duration-300"
          >
            View My Work
          </button>
          <button
            onClick={() => navigate("*contact")}
            className="px-6 py-3 rounded-full border border-gray-400 hover:border-teal-500 hover:text-teal-400 text-gray-200 font-medium transition-all duration-300"
          >
            Let’s Connect
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
