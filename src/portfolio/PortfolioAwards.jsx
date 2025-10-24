import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import * as Icons from "react-icons/fa"; // Import all FontAwesome icons

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
    <section className="bg-zinc-950 text-white py-12 px-4 md:px-16 flex justify-center">

  
      <div className="max-w-7xl w-full">
        <h2 className="text-3xl font-bold mb-10 text-center">
          <span>Recognition &</span> <span className="text-green-700">Awards</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {awards.map((award) => {
            // Get icon component dynamically from React Icons
            const IconComponent = award.icon && Icons[award.icon];

            return (
              <motion.div
                key={award.id}
                className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
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
                <p className="text-gray-300 text-left">{award.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioAwards;
