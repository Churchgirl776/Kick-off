import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { FaExternalLinkAlt } from "react-icons/fa";

const PortfolioProjects = () => {
  const [projects, setProjects] = useState([]);

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

  return (
    <section className="py-20 px-6 md:px-12 bg-black text-white" id="projects">
      {/* ✅ Centered Container */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            Featured <span className="text-green-500">Projects</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            A showcase of recent work that demonstrates my approach to solving
            complex design challenges.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Project Image */}
              <div className="relative w-full h-56 md:h-64 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
                />
                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <a
                    href={project.liveUrl || project.githubUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-black p-4 rounded-full hover:bg-green-400 transition"
                  >
                    <FaExternalLinkAlt className="text-xl" />
                  </a>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <p className="text-green-400 text-sm uppercase font-semibold tracking-wide mb-2">
                  {project.category || "Design & Strategy"}
                </p>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {project.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex justify-between items-center text-sm">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 font-medium transition"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-3">
            Interested in seeing more of my work?
          </p>
          <a
            href="#portfolio"
            className="inline-flex items-center bg-green-500 hover:bg-green-400 text-black font-medium px-5 py-2.5 rounded-lg transition"
          >
            View Full Portfolio
            <FaExternalLinkAlt className="ml-2 text-sm" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PortfolioProjects;
