import React from "react";
import { FaBuilding, FaCalendarAlt, FaArrowsAlt } from "react-icons/fa";

const experiences = [
  {
    id: 1,
    title: "Senior Product Designer & Growth Lead",
    company: "TechCorp Solutions",
    date: " 2023 - Present",
    description: [
    "Led product design for 3 major product launches, resulting in 40% increase in user engagement",
    "Implemented growth design experiments that improved conversion rates by 25%",
    "Managed a team of 4 designers and collaborated with engineering and product teams",
    "Developed company-wide design system used across 12+ products",
    ],
  },
  {
    id: 2,
    title: "Product Design",
    company: "Startup XYZ",
    date: " 2021 - 2022",
    description: [
    "Designed mobile app from concept to launch, acquiring 100k+ users in first 6 months",
    "Conducted user research and usability testing that informed product roadmap",
    "Created wireframes and prototypes for new features that increased retention by 30%",
    "Collaborated with founders to define product strategy and user experience vision",
    ],
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Agency PRO",
    date: "2020 - 2021",
    description: [
      "Designed user experiences for 15+ client projects across various industries",
      "Led client workshops and design sprints to define project requirements",
      "Created comprehensive style guides and design documentation",
    "Mentored junior designers and established design process best practices",
    ],
  },
   {
    id: 4,
    title: "UI/UX Designer",
    company: "Freelance",
    date: "2020 - 2021",
    description: [
     "Worked with 20+ small businesses to redesign their digital presence",
    "Specialized in e-commerce and SaaS product design",
    "Built strong client relationships resulting in 90% repeat business rate",
    "Developed expertise in growth design and conversion optimization",
    ],
  },
];

const Experience = () => {
  return (
    <section className="flex flex-col items-center bg-black text-white py-16 px-4 md:px-20 relative">
      {/* Section Header */}
      <h1 className="text-center text-4xl font-light mb-12">
        Professional <span className="text-green-500 font-light">Experience</span>
      </h1>

      <div className="relative w-full max-w-5xl">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:left-10 md:translate-x-0 w-0.5 bg-gray-500 h-full opacity-50"></div>

        <ul className="space-y-12">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="relative bg-black rounded-lg p-6 shadow-lg border border-gray-700 w-full md:w-3/4 mx-auto md:ml-20 transform transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
            >
              {/* Glowing Timeline Dot */}
              <div className="absolute -left-6 md:-left-12 top-8 w-5 h-5 bg-green-700 border-4 border-gray-900 rounded-full shadow-[0_0_15px_4px_rgba(34,197,94,0.8)]"></div>

              {/* Calendar date */}
              <div className="absolute top-4 right-4 flex items-center text-gray-500 text-sm">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                {exp.date}
              </div>

              {/* Job Title */}
              <h3 className="text-xl font-semibold mb-2 text-white">
                {exp.title}
              </h3>

              {/* Company */}
              <p className="flex items-center text-green-400 font-medium mb-7">
                <FaBuilding className="mr-2 text-green-500" /> {exp.company}
              </p>

              {/* Description List with Arrows */}
              <ul className="text-gray-400 text-sm leading-relaxed space-y-2 mt-3">
                {exp.description.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaArrowsAlt className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div> <br />
      <br />
      <br />
      <div className="mt-10 text-gray-400">Want to learn more about my professional journey?</div>
      <div className="mt-2 text-gray-400"><a href="https://www.linkedin.com/in/abdulaziz-alqarni-9a6b871a5/" className="text-green-500 hover:underline">Get in touch  </a></div>
    </section>
  );
};

export default Experience;
