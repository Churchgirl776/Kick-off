import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import * as Icons from "react-icons/fa"; // Import all FontAwesome icons



const badges = [
  {
    id: 1,
    title: "Awards Won",
    value: "24+",
  },
  {
    id: 2,
    title: "Projects Completed",
    value: "150+",
  },
  {
    id: 3,
    title: "Customer Satisfaction",
    value: "98%",
  },
  {
    id: 4,
    title: "Years of Experience",
    value: "10+",
  },
];


const PortfolioAwards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const awardsRef = collection(db, "awards");
    const q = query(awardsRef, orderBy("year", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const awardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAwards(awardsData);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load awards.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading)
    return <p className="text-center text-gray-400 py-10">Loading awards...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (

    <div className="bg-zinc-950">
    <section className="bg-zinc-950 text-white py-12 px-4 md:px-16 flex justify-center">

  
      <div className="max-w-7xl w-full">
        <h2 className="text-5xl font-light mb-10 text-center">
          <span>Recognition &</span> <span className="text-green-600">Awards</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {awards.map((award) => {
            // Get icon component dynamically from React Icons
            const IconComponent = award.icon && Icons[award.icon];

            return (
              <motion.div
                key={award.id}
                className="bg-black border-1 border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                whileHover={{ scale: 1.03 }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-700 flex items-center justify-center mb-4 shadow-md overflow-hidden text-white text-3xl">
                  {IconComponent ? <IconComponent /> : award.icon || "🏆"}
                </div>

                {/* Year pill */}
                <div className="inline-block bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full mb-3">
                  {award.year}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 text-left transition-colors duration-300 hover:text-green-400">
                  {award.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-left">{award.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      
    </section>
       

       <div className="max-w-7xl mx-auto">

           {/* Summary Section */}
            <div className="mt-12 text-center max-w-3xl mx-auto bg-zinc-950">
              <p className="text-gray-400 text-base font-stretch-100% sm:text-lg leading-relaxed">
                "Our journey is built on innovation, passion, and a relentless pursuit
                of excellence. Each award represents a milestone in our commitment to
                delivering exceptional value, empowering creativity, and setting
                benchmarks across industries."
              </p>
            </div>
      
            {/* Owner Section */}
            <div className="mt-10 flex justify-center">
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-right space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="bg-gradient-to-bl from-teal-600 to-blue-400 text-black font-bold text-xl w-16 h-16 flex items-center justify-center rounded-full shadow-md">
                  JD
                </div>
                <div>
                  <h4 className="text-white text-lg font-semibold text-start">John Doe</h4>
                  <p className="text-gray-400 text-sm">
                    Founder & CEO, BrightTech Solutions
                  </p>
                </div>
              </div>
            </div>
      
            {/* Badges Grid */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className=" p-6 flex flex-col items-center justify-center"
                >
                  {badge.icon}
                  <h5 className="text-3xl font-bold text-green-700 mt-3">{badge.value}</h5>
                  <p className="text-gray-400 text-sm mt-1">{badge.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
    </div>
  );
};

export default PortfolioAwards;
