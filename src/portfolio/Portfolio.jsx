import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Projects from "./Projects";
import Awards from "./Awards";
import Contact from "./Contact"; // Updated contact page with toast + smooth scroll

// Scroll provider for smooth scroll effects
import { Toaster } from "react-hot-toast";
import { Element } from "react-scroll";

function Portfolio() {
  return (
    <div className="min-h-screen bg-black text-gray-200 transition-all duration-500">
      {/* Toast notifications available globally */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Navbar at top */}
      <Navbar />

      {/* Each section wrapped in <Element> for smooth scroll targeting */}
      <Element name="home">
        <Hero />
      </Element>

      <Element name="about">
        <About />
      </Element>

      <Element name="skills">
        <Skills />
      </Element>

      <Element name="experience">
        <Experience />
      </Element>

      <Element name="projects">
        <Projects />
      </Element>

      <Element name="awards">
        <Awards />
      </Element>

      <Element name="contact">
        <Contact />
      </Element>
    </div>
  );
}

export default Portfolio;
