import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { FaBuilding, FaCalendarAlt, FaArrowsAlt } from "react-icons/fa";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "experience"), orderBy("year", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExperiences(expData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="flex flex-col items-center bg-black text-white py-16 px-4 md:px-20 relative" id="experience">
      {/* Section Header */}
      <h1 className="text-center text-4xl font-light mb-12">
        Professional{" "}
        <span className="text-green-500 font-light">Experience</span>
      </h1>

      <div className="relative w-full max-w-5xl">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:left-10 md:translate-x-0 w-0.5 bg-gray-500 h-full opacity-50"></div>

        <ul className="space-y-12">
          {experiences.length === 0 ? (
            <p className="text-gray-500 text-center">
              Loading experiences...
            </p>
          ) : (
            experiences.map((exp) => (
              <li
                key={exp.id}
                className="relative bg-black rounded-lg p-6 shadow-lg border border-gray-700 w-full md:w-3/4 mx-auto md:ml-20 transform transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Glowing Timeline Dot */}
                <div className="absolute -left-6 md:-left-12 top-8 w-5 h-5 bg-green-700 border-4 border-gray-900 rounded-full shadow-[0_0_15px_4px_rgba(34,197,94,0.8)]"></div>

                {/* Calendar date */}
                <div className="absolute top-4 right-4 flex items-center text-gray-500 text-sm">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  {exp.year}
                </div>

                {/* Job Title */}
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {exp.title}
                </h3>

                {/* Company */}
                <p className="flex items-center text-green-400 font-medium mb-7">
                  <FaBuilding className="mr-2 text-green-500" /> {exp.company}
                </p>

                {/* Description List */}
                <ul className="text-gray-400 text-sm leading-relaxed space-y-2 mt-3">
                  {exp.services?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FaArrowsAlt className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-10 text-gray-400 text-center">
        Want to learn more about my professional journey? <br />
        <a
          href="https://www.linkedin.com/in/abdulaziz-alqarni-9a6b871a5/"
          className="text-green-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
};

export default Experience;
