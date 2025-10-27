import React, { useState, useEffect } from "react";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";

// Map Firestore "name" values to icons
const iconMap = {
  linkedin: <FaLinkedin size={20} />,
  twitter: <FaTwitter size={20} />,
  github: <FaGithub size={20} />,
  facebook: <FaFacebookF size={20} />,
  instagram: <FaInstagram size={20} />,
  youtube: <FaYoutube size={20} />,
  website: <FaGlobe size={20} />,
};

const Contact = () => {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [socialLinks, setSocialLinks] = useState([]);

  // 🔹 Fetch dynamic social media links from Firestore
  useEffect(() => {
    const q = query(collection(db, "socialMedia"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const links = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSocialLinks(links);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    toast.loading("Sending message...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Message sent successfully! 🚀");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const scrollToTop = () =>
    scroll.scrollToTop({ smooth: true, duration: 600 });

  return (
    <div
      className={`min-h-screen py-16 px-6 sm:px-10 lg:px-20 transition-colors duration-500 ${
        darkMode ? "bg-[#0a0a0f] text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
      id="contact"
    >
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="text-center mb-12">
        <h2
          className={`text-3xl sm:text-4xl font-bold transition-colors duration-500 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Let’s Work <span className="text-green-500">Together</span>
        </h2>
        <p
          className={`mt-3 max-w-2xl mx-auto transition-colors duration-500 ${
            darkMode ? "text-gray-400" : "text-gray-700"
          }`}
        >
          Ready to bring your ideas to life? Let’s discuss how we can create
          something amazing together.
        </p>
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side */}
        <div>
          <h3
            className={`text-xl font-semibold mb-4 transition-colors duration-500 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Get in Touch
          </h3>
          <p
            className={`mb-6 transition-colors duration-500 ${
              darkMode ? "text-gray-400" : "text-gray-700"
            }`}
          >
            I’m always excited to work on new projects and collaborate with
            passionate minds. Whether you have a specific project in mind or
            just want to explore possibilities, I’d love to hear from you.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <FaEnvelope className="text-green-500" />
              <span>hello@designer.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <FaPhone className="text-green-500" />
              <span>+1 (829) 120-6542</span>
            </li>
            <li className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-green-500" />
              <span>San Francisco, CA</span>
            </li>
          </ul>

          {/* 🔹 Dynamic Social Links */}
          <div className="mt-6 flex items-center flex-wrap gap-5">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition ${
                    darkMode
                      ? "text-gray-400 hover:text-green-500"
                      : "text-gray-600 hover:text-green-500"
                  }`}
                  title={link.displayName || link.name}
                >
                  {iconMap[link.name?.toLowerCase()] || <FaGlobe size={20} />}
                </a>
              ))
            ) : (
              <p
                className={`text-sm transition-colors duration-500 ${
                  darkMode ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Loading social links...
              </p>
            )}
          </div>

          {/* Availability */}
          <div
            className={`mt-8 p-4 rounded-lg border transition-colors duration-500 ${
              darkMode
                ? "bg-gray-900 border-green-600"
                : "bg-green-50 border-green-500"
            }`}
          >
            <p
              className={`flex items-center space-x-2 font-semibold transition-colors duration-500 ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Available for New Projects</span>
            </p>
            <p
              className={`text-sm mt-2 transition-colors duration-500 ${
                darkMode ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Currently accepting freelance projects and full-time opportunities.
              Let’s discuss your next big idea.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={`p-8 rounded-lg shadow-lg space-y-5 transition-colors duration-500 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={`w-full p-3 rounded transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-800 text-gray-200 focus:ring-green-500"
                  : "bg-gray-100 text-gray-900 focus:ring-green-500"
              } focus:outline-none focus:ring-2`}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={`w-full p-3 rounded transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-800 text-gray-200 focus:ring-green-500"
                  : "bg-gray-100 text-gray-900 focus:ring-green-500"
              } focus:outline-none focus:ring-2`}
            />
          </div>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What’s this about?"
            className={`w-full p-3 rounded transition-colors duration-500 ${
              darkMode
                ? "bg-gray-800 text-gray-200 focus:ring-green-500"
                : "bg-gray-100 text-gray-900 focus:ring-green-500"
            } focus:outline-none focus:ring-2`}
          />

          <textarea
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project goals, timeline, and budget..."
            className={`w-full p-3 rounded transition-colors duration-500 ${
              darkMode
                ? "bg-gray-800 text-gray-200 focus:ring-green-500"
                : "bg-gray-100 text-gray-900 focus:ring-green-500"
            } focus:outline-none focus:ring-2`}
          ></textarea>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-500 text-black font-semibold py-3 rounded hover:bg-green-400 transition"
          >
            Send Message
          </motion.button>

          <p
            className={`text-sm text-center transition-colors duration-500 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            I typically respond within 24 hours. Looking forward to hearing from
            you!
          </p>
        </motion.form>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 border-t transition-colors duration-500 border-gray-800 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
  <div>
    <h4
      className={`font-semibold mb-4 transition-colors duration-500 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      Portfolio
    </h4>
    <p className={darkMode ? "text-gray-400" : "text-gray-700"}>
      Creating digital experiences that drive growth and deliver tangible
      results. Let’s build something amazing together.
    </p>
  </div>

  <div>
    <h4
      className={`font-semibold mb-4 transition-colors duration-500 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      Quick Links
    </h4>
    <ul className="space-y-2">
      {[
        "home",
        "about",
        "skills",
        "experience",
        "projects",
        "awards",
        "contact",
      ].map((item) => (
        <li key={item}>
          <ScrollLink
            to={item}
            smooth={true}
            duration={600}
            className={`transition-colors duration-300 cursor-pointer hover:text-green-500 ${
              darkMode ? "text-gray-400" : "text-gray-700"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </ScrollLink>
        </li>
      ))}
    </ul>
  </div>

  {/* Right Side - Let's Connect + Admin Button */}
  <div className="text-center md:text-right">
    <h4
      className={`font-semibold mb-4 transition-colors duration-500 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      Let’s Connect
    </h4>
    <p
      className={`mb-4 transition-colors duration-500 ${
        darkMode ? "text-gray-400" : "text-gray-700"
      }`}
    >
      Ready to start your next project? Get in touch and let’s create something
      great together.
    </p>

    {/* 🌟 Start Project Button */}
    <ScrollLink
      to="contact"
      smooth={true}
      duration={600}
      className="inline-block bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400 transition cursor-pointer mr-3"
    >
      Start a Project
    </ScrollLink>

    {/* 🔐 Admin Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => (window.location.href = "/admin")}
      className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded font-semibold border transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-green-400 border-green-600 hover:bg-green-500 hover:text-black"
          : "bg-white text-green-600 border-green-500 hover:bg-green-500 hover:text-white"
      }`}
    >
      <FaGlobe />
      Admin
    </motion.button>
  </div>
</footer>

{/* Bottom Bar */}
<div
  className={`mt-10 text-center border-t pt-6 text-sm transition-colors duration-500 ${
    darkMode ? "text-gray-500 border-gray-800" : "text-gray-600 border-gray-300"
  }`}
>
  <p>© 2025 Portfolio. Made with ❤️ by a passionate designer.</p>
  <div className="mt-4 flex justify-center">
    <motion.button
      whileHover={{ y: -4 }}
      onClick={scrollToTop}
      className="flex items-center space-x-2 bg-green-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-green-400 transition"
    >
      <FaArrowUp />
      <span>Back to Top</span>
    </motion.button>
  </div>
</div>

    </div>
  );
};

export default Contact;
