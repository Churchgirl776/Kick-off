import React from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] transition-all duration-500">
      <Navbar />
      <Hero />
      <About />
    </div>
  );
}

export default App;
