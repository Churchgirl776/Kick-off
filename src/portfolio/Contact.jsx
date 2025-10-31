import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
  FaArrowUp,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const iconMap = {
  linkedin: <FaLinkedin size={20} />,
  twitter: <FaTwitter size={20} />,
  github: <FaGithub size={20} />,
  facebook: <FaFacebookF size={20} />,
  instagram: <FaInstagram size={20} />,
  youtube: <FaYoutube size={20} />,
  website: <FaGlobe size={20} />,
};

function Contact() {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // detect login
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // fetch socials
  useEffect(() => {
    const q = query(collection(db, "socialMedia"), orderBy("name", "asc"));
    return onSnapshot(q, (snap) => {
      setSocialLinks(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // handle input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // save contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message)
      return toast.error("Please fill in all required fields.");

    try {
      await addDoc(collection(db, "contactResponses"), {
        ...formData,
        timestamp: serverTimestamp(),
        read: false, // optional for admin tracking
      });
      toast.success("Message sent successfully! 🚀");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again.");
    }
  };

  // route admin
  const handleAdminClick = () => {
    if (user) navigate("/admin");
    else {
      toast.error("⚠️ Please log in to access the admin dashboard.");
      navigate("/login");
    }
  };

  return (
    <div
      className={`min-h-screen w-full px-5 sm:px-10 py-16 transition-colors duration-500 ${
        isDark ? "bg-[#0a0a0f] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Let’s Work <span className="text-green-500">Together</span>
          </h2>
          <p
            className={`mt-3 text-base sm:text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Ready to bring your ideas to life? Let’s create something amazing.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Get in Touch</h3>
            <p
              className={`text-base ${isDark ? "text-gray-400" : "text-gray-700"}`}
            >
              I’m always open to collaborations and exciting projects.
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

            {/* Social icons */}
            <div className="flex flex-wrap gap-4 mt-5">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:text-green-500 transition ${
                    isDark ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  {iconMap[link.name?.toLowerCase()] || <FaGlobe size={20} />}
                </a>
              ))}
            </div>

            {/* Availability Card */}
            <div
              className={`rounded-xl border border-green-500 p-4 ${
                isDark ? "bg-zinc-900" : "bg-white shadow-md"
              }`}
            >
              <p className="text-green-400 font-semibold flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Available for New Projects</span>
              </p>
              <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Accepting freelance & full-time opportunities.
              </p>
            </div>

            {/* Admin Button */}
            <motion.button
              onClick={handleAdminClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-green-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-green-400 transition"
            >
              <FaUserShield />
              <span>Admin</span>
            </motion.button>
          </div>

          {/* RIGHT SIDE — FORM */}
          <motion.form
            onSubmit={handleSubmit}
            whileHover={{ scale: 1.01 }}
            className={`rounded-xl p-6 sm:p-8 w-full ${
              isDark ? "bg-zinc-900" : "bg-white shadow-lg"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700 text-gray-200"
                    : "bg-gray-100 border-gray-300 text-gray-800"
                }`}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700 text-gray-200"
                    : "bg-gray-100 border-gray-300 text-gray-800"
                }`}
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full mt-4 p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-gray-200"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full mt-4 p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none resize-none ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-gray-200"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 bg-green-500 text-black py-3 rounded-lg font-semibold hover:bg-green-400 transition"
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 border-t border-gray-700 pt-6 text-sm">
          <p className={`${isDark ? "text-gray-500" : "text-gray-700"} mb-4`}>
            © 2025 Portfolio. Made with ❤️ by a passionate designer.
          </p>
          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center space-x-2 bg-green-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-green-400 transition"
          >
            <FaArrowUp />
            <span>Back to Top</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
