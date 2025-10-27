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
  FaUserShield,
} from "react-icons/fa";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Check login status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);

  // 🔹 Fetch dynamic social links
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

  const handleAdminClick = () => {
    if (user) {
      navigate("/admin");
    } else {
      toast.error("⚠️ Please log in first to access the admin dashboard.");
      navigate("/login");
    }
  };

  const scrollToTop = () => scroll.scrollToTop({ smooth: true, duration: 600 });

  return (
    <div
      className="bg-black text-gray-200 min-h-screen py-16 px-6 sm:px-10 lg:px-20"
      id="contact"
    >
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Let’s Work <span className="text-green-500">Together</span>
        </h2>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Ready to bring your ideas to life? Let’s discuss how we can create
          something amazing together.
        </p>
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>
          <p className="text-gray-400 mb-6">
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
                  className="text-gray-400 hover:text-green-500 transition"
                  title={link.displayName || link.name}
                >
                  {iconMap[link.name?.toLowerCase()] || <FaGlobe size={20} />}
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Loading social links...</p>
            )}
          </div>

          {/* Availability */}
          <div className="mt-8 bg-zinc-900 border border-green-600 rounded-lg p-4">
            <p className="text-green-400 font-semibold flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Available for New Projects</span>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Currently accepting freelance projects and full-time opportunities.
              Let’s discuss your next big idea.
            </p>
          </div>

          {/* 🔹 Admin Button */}
          <div className="mt-6">
            <motion.button
              onClick={handleAdminClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400 transition"
            >
              <FaUserShield />
              <span>Admin</span>
            </motion.button>
          </div>
        </div>

        {/* Right: Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900 p-8 rounded-lg shadow-lg space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full p-3 rounded bg-zinc-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full p-3 rounded bg-zinc-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What’s this about?"
            className="w-full p-3 rounded bg-zinc-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project goals, timeline, and budget..."
            className="w-full p-3 rounded bg-zinc-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-500 text-black font-semibold py-3 rounded hover:bg-green-400 transition"
          >
            Send Message
          </motion.button>

          <p className="text-gray-500 text-sm text-center">
            I typically respond within 24 hours. Looking forward to hearing from you!
          </p>
        </motion.form>
      </div>

      {/* Footer and Bottom Bar same as before */}
      <div className="mt-10 text-center border-t border-gray-800 pt-6 text-gray-500 text-sm">
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
