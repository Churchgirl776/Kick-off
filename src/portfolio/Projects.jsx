import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const projects = [
  {
    id: 1,
    title: "Product Design And Strategy",
    subtitle: "E-commerce Growth Platform",
    description:
      "Complete redesign of an e-commerce platform focusing on conversion optimization and user retention. Enhanced UX, streamlined checkout, and modern interface.",
    images: [
      "https://images.unsplash.com/photo-1581093588401-22bba3e3e6c5",
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
      "https://images.unsplash.com/photo-1602526216437-31cbe4b34f77",
    ],
    demo: "#",
    source: "#",
  },
  {
    id: 2,
    title: "The Gastronomia Experience",
    subtitle: "Luxury Restaurant Platform",
    description:
      "An immersive restaurant reservation platform with dynamic parallax effects, Framer Motion animations, and responsive UI components.",
    images: [
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?fit=crop&w=800",
    ],
    demo: "#",
    source: "#",
  },
  {
    id: 3,
    title: "Storyland",
    subtitle: "Interactive Storytelling App",
    description:
      "A storytelling app featuring a typewriter effect, sound effects, and animated route transitions for an engaging narrative experience.",
    images: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    ],
    demo: "#",
    source: "#",
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) =>
      (prev + 1) % selectedProject.images.length
    );
  };

  const handlePrev = () => {
    setCurrentImage((prev) =>
      (prev - 1 + selectedProject.images.length) %
      selectedProject.images.length
    );
  };

  return (
    <section className="relative bg-black text-white py-16 px-6 md:px-16">
      <div className="text-center mb-12">
        <motion.h1
          className="text-3xl md:text-5xl font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Featured <span className="text-green-700">Projects</span>
        </motion.h1>
        <p className="text-gray-400 mt-3 text-lg font-extralight text-center">
          A showcase of recent work that demonstrates my approach to solving complex design challenges
        </p>
      </div>

      {/* Project Cards */}
      <motion.div
        className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer group"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            onClick={() => {
              setSelectedProject(project);
              setCurrentImage(0);
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-48 object-cover transition-all duration-300 group-hover:opacity-70"
              />
              {/* Preview Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <FaSearch className="text-white text-4xl" />
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2 text-green-400">
                {project.title}
              </h2>
              <h2 className="text-2xl font-semibold mb-2 text-gray-200 group-hover:text-green-400 transition-all duration-300">
                {project.subtitle}
              </h2>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              {/* <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-800/30 text-green-300 px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div> */}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal Section */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Blurred Background */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />

            {/* Modal Box */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-900 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-xl relative">
                {/* Close Button */}
                <button
                  className="absolute top-3 right-4 text-gray-400 hover:text-green-400 text-2xl"
                  onClick={() => setSelectedProject(null)}
                >
                  &times;
                </button>

                {/* Carousel */}
                <div className="relative">
                  <img
                    src={selectedProject.images[currentImage]}
                    alt={selectedProject.title}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                  />

                  {/* Prev Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full"
                  >
                    <FaChevronLeft className="text-white" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full"
                  >
                    <FaChevronRight className="text-white" />
                  </button>
                </div>

                {/* Modal Content */}
                <h2 className="text-2xl font-semibold text-green-400 mb-2">
                  {selectedProject.title}
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  {selectedProject.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-green-800/30 text-green-300 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                  >
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-800/40 transition-all"
                  >
                    Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <br />
      <br />

      <div className="mt-10 text-gray-300 text-center"> Interested in seeing more of my work?</div>
      <button className="flex border border-gray-400 text-center gap-3 bg-gray-950 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all mt-4 mx-auto">View full portfolio <FaSearch/></button>
    </section>
  );
};

export default Projects;
