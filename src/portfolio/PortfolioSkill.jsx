import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PortfolioSkill = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section
      id="skills"
      className="flex flex-col justify-center items-center py-10 md:py-12 px-6 md:px-12 bg-[#0a0a0a] text-white mb-10"
    >
      <div className="w-full max-w-7xl">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-3">
          Skills <span className="text-emerald-400">& Expertise</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          A comprehensive toolkit for creating products that drive growth and
          deliver exceptional user experiences.
        </p>

        {/* Skill Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="group bg-[#141414] border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon + Name Row */}
              <div className="flex items-center space-x-4 mb-3 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
                  {skill.icon ? (
                    skill.icon.startsWith("http") ? (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">{skill.icon}</span>
                    )
                  ) : (
                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-emerald-400">
                    {skill.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              {skill.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-3 group-hover:line-clamp-none transition-all text-left">
                  {skill.description}
                </p>
              )}

              {/* Technologies Pills */}
              {skill.technologies && skill.technologies.length > 0 && (
                <div className="flex flex-wrap justify-start gap-2 mt-4">
                  {skill.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700 hover:border-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSkill;
