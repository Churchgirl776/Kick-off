import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query,  } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Slider from "react-slick";
import { useTheme } from "../context/ThemeContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Feedback = () => {
  const { darkMode } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch messages from contactResponse collection
    const q = query(
      collection(db, "contactResponses"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(data);
    });

    return () => unsubscribe();
  }, []);

  // React Slick carousel settings
  const settings = {
    dots: false,
    infinite: feedbacks.length > 1,
    speed: 500,
    slidesToShow: Math.min(feedbacks.length, 4),
    slidesToScroll: 1,
    arrows: true,
    centerMode: feedbacks.length === 1,
    centerPadding: "0px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(feedbacks.length, 3) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(feedbacks.length, 2) } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const bgMain = darkMode ? "bg-zinc-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardBg = darkMode ? "bg-zinc-950 text-gray-100" : "bg-white text-gray-900";
  const titleColor = darkMode ? "text-green-300" : "text-green-700";

  return (
    <section className={`py-10 px-4 sm:px-8 ${bgMain}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl font-semibold text-center mb-8 ${titleColor}`}>
          What People Say
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No feedback yet.</p>
        ) : (
          <Slider {...settings}>
            {feedbacks.map((f) => (
              <div key={f.id} className="p-2">
                <div
                  className={`p-6 rounded-xl text-center shadow-md hover:shadow-lg transition h-full flex flex-col justify-between ${cardBg}`}
                >
                  <p className="italic mb-4 break-words">“{f.message}”</p>
                  <h4 className={`font-semibold mt-auto ${titleColor}`}>
                    {f.name || "Anonymous"}
                  </h4>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default Feedback;
