import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    });
    return () => unsubscribe();
  }, []);

  const selectedProject =
    selectedIndex !== null && projects[selectedIndex]
      ? projects[selectedIndex]
      : null;

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === projects.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? projects.length - 1 : prev - 1
    );
  };

  // Carousel settings
  const sliderSettings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    dots: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-black text-white" id="projects">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            Featured <span className="text-green-500">Projects</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            A showcase of creative projects — blending strategy, design, and
            development to drive growth.
          </p>
        </div>

        {/* Carousel */}
        <Slider {...sliderSettings}>
          {projects.map((project, index) => (
            <div key={project.id} className="px-3">
              <div
                onClick={() => setSelectedIndex(index)}
                className="group cursor-pointer bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative w-full h-56 md:h-64 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-70"
                  />
                </div>
                <div className="p-6">
                  <p className="text-green-400 text-sm uppercase font-semibold tracking-wide mb-2">
                    {project.category || "Design & Strategy"}
                  </p>
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* View Full Portfolio Button */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-3">Want to explore more projects?</p>
          <button
            onClick={() => setShowPortfolioModal(true)}
            className="inline-flex items-center bg-green-500 hover:bg-green-400 text-black font-medium px-5 py-2.5 rounded-lg transition"
          >
            View Full Portfolio
            <FaExternalLinkAlt className="ml-2 text-sm" />
          </button>
        </div>
      </div>

      {/* 🔹 Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="bg-zinc-900 rounded-xl max-w-3xl w-full p-6 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              <FiX />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 transition"
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 transition"
            >
              <FiChevronRight size={22} />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.name}
                className="w-full md:w-1/2 h-64 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-400 mb-2">
                  {selectedProject.name}
                </h3>
                <p className="text-gray-300 mb-3">
                  {selectedProject.description}
                </p>

                <ul className="text-sm text-gray-400 space-y-1">
                  {selectedProject.owner && (
                    <li>
                      <span className="text-white font-semibold">Owner:</span>{" "}
                      {selectedProject.owner}
                    </li>
                  )}
                  {selectedProject.status && (
                    <li>
                      <span className="text-white font-semibold">Status:</span>{" "}
                      {selectedProject.status}
                    </li>
                  )}
                  {selectedProject.progress && (
                    <li>
                      <span className="text-white font-semibold">Progress:</span>{" "}
                      {selectedProject.progress}
                    </li>
                  )}
                  {selectedProject.technologies && (
                    <li>
                      <span className="text-white font-semibold">Tech:</span>{" "}
                      {Array.isArray(selectedProject.technologies)
                        ? selectedProject.technologies.join(", ")
                        : selectedProject.technologies}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Stages / Process */}
            {selectedProject.stages?.length > 0 && (
              <>
                <h4 className="text-lg font-semibold text-green-400 mb-2">
                  Project Stages
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">
                  {selectedProject.stages.map((stage, index) => (
                    <li key={index}>{stage}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Gallery */}
            {selectedProject.gallery?.length > 0 && (
              <>
                <h4 className="text-lg font-semibold text-green-400 mb-2">
                  Gallery
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {selectedProject.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Gallery ${i}`}
                      className="rounded-lg w-full h-32 object-cover hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Full Portfolio Modal (Grid Display) */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-6xl w-full relative shadow-2xl">
            <button
              onClick={() => setShowPortfolioModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              <FiX />
            </button>

            <h3 className="text-3xl font-bold text-center mb-8 text-green-400">
              Full Portfolio
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    setShowPortfolioModal(false);
                  }}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {project.name}
                    </h4>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
