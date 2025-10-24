import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaGlobe,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const iconMap = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  github: <FaGithub />,
  youtube: <FaYoutube />,
  website: <FaGlobe />,
};

const SocialMedia = ({ theme = "light" }) => {
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    url: "",
  });

  // 🔹 Firestore real-time listener
  useEffect(() => {
    const q = query(collection(db, "socialMedia"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLinks(data);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenForm = (link = null) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        name: link.name,
        displayName: link.displayName,
        url: link.url,
      });
    } else {
      setEditingLink(null);
      setFormData({ name: "", displayName: "", url: "" });
    }
    setShowForm(true);
  };

  const handleSave = async () => {
    const { name, displayName, url } = formData;
    if (!name || !url) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      if (editingLink) {
        await updateDoc(doc(db, "socialMedia", editingLink.id), {
          name,
          displayName,
          url,
        });
      } else {
        await addDoc(collection(db, "socialMedia"), { name, displayName, url });
      }
      setShowForm(false);
      setEditingLink(null);
      setFormData({ name: "", displayName: "", url: "" });
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this social media link?")) {
      try {
        await deleteDoc(doc(db, "socialMedia", id));
      } catch (error) {
        console.error("Error deleting link:", error);
      }
    }
  };

  // Theme classes
  const bgMain = theme === "dark" ? "bg-zinc-900 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardBg = theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200";
  const inputBg = theme === "dark" ? "bg-zinc-700 text-gray-100 border-zinc-600 placeholder-gray-400" : "bg-gray-100 text-black border-gray-300 placeholder-gray-500";
  const modalBg = theme === "dark" ? "bg-zinc-900 text-gray-100 border-zinc-700" : "bg-white text-black border-gray-300";

  return (
    <section className={`flex flex-col items-center py-16 px-6 md:px-12 ${bgMain}`}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
        Manage Your <span className="text-emerald-600">Social Media</span>
      </h2>
      <p className={theme === "dark" ? "text-gray-300 text-center mb-10 max-w-xl" : "text-gray-600 text-center mb-10 max-w-xl"}>
        Add, edit, or delete your social media handles dynamically — changes update in real time.
      </p>

      {/* Social Links */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {links.length === 0 ? (
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No social media links yet.</p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={`group flex flex-col items-center text-center p-5 rounded-lg border ${cardBg} hover:border-emerald-400 hover:shadow-lg transition-all duration-300`}
            >
              <div className="text-2xl text-emerald-500 group-hover:text-emerald-400 transition mb-2">
                {iconMap[link.name.toLowerCase()] || <FaGlobe />}
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-emerald-600 transition"
              >
                {link.displayName || link.name}
              </a>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleOpenForm(link)}
                  className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-sm bg-red-500 hover:bg-red-400 text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => handleOpenForm()}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg transition"
      >
        <FaPlus /> Add Social Media
      </button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className={`rounded-xl p-8 w-full max-w-lg relative shadow-xl border ${modalBg}`}>
            <h3 className="text-2xl font-semibold mb-4 text-emerald-600">
              {editingLink ? "Edit Social Media" : "Add New Social Media"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Platform Name (e.g. github, linkedin)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-3 rounded-lg focus:border-emerald-500 outline-none ${inputBg}`}
              />
              <input
                type="text"
                placeholder="Display Name (e.g. GitHub, LinkedIn)"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className={`w-full p-3 rounded-lg focus:border-emerald-500 outline-none ${inputBg}`}
              />
              <input
                type="text"
                placeholder="Profile URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className={`w-full p-3 rounded-lg focus:border-emerald-500 outline-none ${inputBg}`}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2 rounded-lg transition"
              >
                {editingLink ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialMedia;
