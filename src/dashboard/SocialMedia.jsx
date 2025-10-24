import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

const SocialMedia = () => {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    url: "",
  });

  const [socialLinks, setSocialLinks] = useState([]);

  // 🔹 Fetch social media links from Firestore
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

  // 🔹 Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.url) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      await addDoc(collection(db, "socialMedia"), formData);
      toast.success(`${formData.displayName || formData.name} added successfully!`);
      setFormData({ name: "", displayName: "", url: "" });
    } catch (err) {
      console.error("Error adding social link:", err);
      toast.error("Failed to add social media link. Try again!");
    }
  };

  // 🔹 Handle delete
  const handleDelete = async (id, name) => {
    const confirmDelete = confirm(`Delete ${name}?`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "socialMedia", id));
      toast.success(`${name} deleted successfully!`);
    } catch (err) {
      console.error("Error deleting link:", err);
      toast.error("Failed to delete link.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-16 px-6 sm:px-10 lg:px-20">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        Manage <span className="text-green-600">Social Media Links</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-8 rounded-xl shadow-md space-y-5 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Add New Social Media
          </h3>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Platform (e.g., LinkedIn)"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Display Name (optional)"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="Profile URL (e.g., https://linkedin.com/in/username)"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-500 text-white font-semibold py-3 rounded hover:bg-green-600 transition"
          >
            Add Social Media
          </motion.button>
        </motion.form>

        {/* Display Section */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Links</h3>

          {socialLinks.length > 0 ? (
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li
                  key={link.id}
                  className="flex justify-between items-center border p-3 rounded hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {link.displayName || link.name}
                    </p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(link.id, link.name)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </motion.button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No social media links added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
