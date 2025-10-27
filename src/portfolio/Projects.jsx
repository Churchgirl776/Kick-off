import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../context/ThemeContext";

const Projects = () => {
  const { darkMode } = useTheme();
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

  const handleProjectClick = (index) => setSelectedIndex(index);
  const handleNext = () => setSelectedIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setSelectedIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));

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
    <section
      className={`py-20 px-6 md:px-12 transition-all duration-500 ${
        darkMode ? "bg-[#0a0a0f] text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
      id="projects"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold transition-colors duration-500`}>
            Featured <span className="text-green-500">Projects</span>
          </h2>
          <p className={`mt-3 max-w-2xl mx-auto transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            A showcase of creative projects — blending strategy, design, and development to drive growth.
          </p>
        </div>

        {/* Carousel */}
        <Slider {...sliderSettings}>
          {projects.map((project, index) => (
            <div key={project.id} className="px-3">
              <div
                onClick={() => handleProjectClick(index)}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${
                  darkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div className="relative w-full h-56 md:h-64 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-white p-4 rounded-full hover:transition">
                      <FaExternalLinkAlt className="text-4xl font-light" />
                    </div>
                  </div>
                </div>

                <div className="p-6 text-left">
                  <p className={`text-sm uppercase font-semibold tracking-wide mb-2 transition-colors duration-500 ${darkMode ? "text-green-400" : "text-green-500"}`}>
                    {project.category || "Design & Strategy"}
                  </p>
                  <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {project.name}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-4 line-clamp-3 transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Full Portfolio Button */}
        <div className="text-center mt-16">
          <p className={`mb-3 transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Want to explore more projects?
          </p>
          <button
            onClick={() => setShowPortfolioModal(true)}
            className="inline-flex items-center bg-green-500 hover:bg-green-400 text-black font-medium px-5 py-2.5 rounded-lg transition"
          >
            View Full Portfolio
            <FaExternalLinkAlt className="ml-2 text-sm" />
          </button>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto transition-all duration-500 ${darkMode ? "bg-black/70" : "bg-gray-200/60"}`}>
          <div className={`rounded-xl max-w-3xl w-full p-6 relative shadow-2xl transition-colors duration-500 ${darkMode ? "bg-black" : "bg-white"}`}>
            <button
              onClick={() => setSelectedIndex(null)}
              className={`absolute top-4 right-4 text-2xl transition-colors duration-300 ${darkMode ? "text-green-400 hover:text-white" : "text-green-600 hover:text-black"}`}
            >
              <FiX />
            </button>

            {/* Navigation */}
            <button
              onClick={handlePrev}
              className={`absolute top-1/2 -left-6 transform -translate-y-1/2 rounded-full p-2 transition-colors duration-300 ${darkMode ? "bg-black/50 hover:bg-black text-white" : "bg-gray-200/50 hover:bg-gray-300 text-gray-900"}`}
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className={`absolute top-1/2 -right-6 transform -translate-y-1/2 rounded-full p-2 transition-colors duration-300 ${darkMode ? "bg-black/50 hover:bg-black text-white" : "bg-gray-200/50 hover:bg-gray-300 text-gray-900"}`}
            >
              <FiChevronRight size={22} />
            </button>

            {/* Project Content */}
            <div className="w-full mb-5">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.name}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>

            <div className="text-left space-y-4">
              <h3 className={`text-2xl font-bold transition-colors duration-500 ${darkMode ? "text-green-400" : "text-green-500"}`}>
                {selectedProject.name}
              </h3>
              <p className={`leading-relaxed transition-colors duration-500 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {selectedProject.description}
              </p>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {selectedProject.owner && <div><span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Owner:</span> {selectedProject.owner}</div>}
                {selectedProject.status && <div><span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Status:</span> {selectedProject.status}</div>}
                {selectedProject.progress && <div><span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Progress:</span> {selectedProject.progress}</div>}
                {selectedProject.technologies && (
                  <div className={`sm:col-span-2`}>
                    <span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Technologies:</span>{" "}
                    {Array.isArray(selectedProject.technologies) ? selectedProject.technologies.join(", ") : selectedProject.technologies}
                  </div>
                )}
              </div>
            </div>

            {/* Stages */}
            {selectedProject.stages?.length > 0 && (
              <div className="mt-6">
                <h4 className={`text-lg font-semibold mb-2 transition-colors duration-500 ${darkMode ? "text-green-400" : "text-green-500"}`}>Project Stages</h4>
                <ul className={`list-disc list-inside space-y-1 transition-colors duration-500 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {selectedProject.stages.map((stage, i) => <li key={i}>{stage}</li>)}
                </ul>
              </div>
            )}

            {/* Gallery */}
            {selectedProject.gallery?.length > 0 && (
              <div className="mt-6">
                <h4 className={`text-lg font-semibold mb-2 transition-colors duration-500 ${darkMode ? "text-green-400" : "text-green-500"}`}>Gallery</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedProject.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Gallery ${i}`}
                      className="rounded-lg w-full h-32 object-cover hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Portfolio Modal */}
      {showPortfolioModal && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center pt-16 overflow-y-auto transition-all duration-500 ${darkMode ? "bg-black/80" : "bg-gray-200/60"}`}>
          <div className={`rounded-xl p-6 max-w-6xl w-full relative shadow-2xl transition-colors duration-500 ${darkMode ? "bg-black" : "bg-white"}`}>
            <button
              onClick={() => setShowPortfolioModal(false)}
              className={`absolute top-4 right-4 text-2xl transition-colors duration-300 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              <FiX />
            </button>

            <h3 className={`text-3xl font-bold text-center transition-colors duration-500 ${darkMode ? "text-green-400" : "text-green-500"}`}>Full Portfolio</h3>
            <br /><br />

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-2 sm:px-4">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => { setSelectedIndex(index); setShowPortfolioModal(false); }}
                  className={`rounded-xl overflow-hidden border cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
                    darkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <img src={project.imageUrl} alt={project.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className={`text-lg font-semibold mb-1 transition-colors duration-500 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>{project.name}</h4>
                    <p className={`text-sm line-clamp-2 transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{project.description}</p>
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
