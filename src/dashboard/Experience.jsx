import React, { useState, useEffect } from "react";
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
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    year: "",
    services: "",
  });

  // 🔹 Load experiences from Firestore in real-time
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

  // 🔹 Open modal for add/edit
  const handleOpenForm = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        title: exp.title,
        company: exp.company,
        year: exp.year,
        services: exp.services.join("\n"),
      });
    } else {
      setEditingExp(null);
      setFormData({ title: "", company: "", year: "", services: "" });
    }
    setShowForm(true);
  };

  // 🔹 Save to Firestore (Add or Update)
  const handleSave = async () => {
    const newExp = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      year: formData.year.trim(),
      services: formData.services
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (!newExp.title || !newExp.company || !newExp.year) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const toastId = toast.loading(
      editingExp ? "Updating experience..." : "Saving experience..."
    );

    try {
      if (editingExp) {
        await updateDoc(doc(db, "experience", editingExp.id), newExp);
        toast.success("Experience updated successfully ✅", { id: toastId });
      } else {
        await addDoc(collection(db, "experience"), newExp);
        toast.success("Experience added successfully 🚀", { id: toastId });
      }

      setShowForm(false);
      setEditingExp(null);
      setFormData({ title: "", company: "", year: "", services: "" });
    } catch (error) {
      toast.error("Error saving experience ❌", { id: toastId });
    }
  };

  // 🔹 Delete experience with confirmation toast
  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <p className="text-sm font-medium mb-2">
          Are you sure you want to delete this experience?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const deletingToast = toast.loading("Deleting experience...");
              try {
                await deleteDoc(doc(db, "experience", id));
                toast.success("Experience deleted 🗑️", { id: deletingToast });
              } catch (err) {
                toast.error("Error deleting experience ❌", {
                  id: deletingToast,
                });
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <section
      id="experience"
      className="py-16 px-6 md:px-12 bg-transparent text-black flex flex-col items-center"
    >
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#111",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      <div className="w-full max-w-6xl">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-3">
          Professional <span className="text-green-900">Experience</span>
        </h2>
        <p className="text-gray-900 text-center mb-12 max-w-2xl mx-auto">
          Manage and showcase your career journey dynamically — add, edit, or
          delete experiences easily.
        </p>

        {/* Experience Cards */}
        <div className="space-y-10">
          {experiences.length === 0 ? (
            <p className="text-gray-900 text-center">
              No experience added yet. Click below to get started.
            </p>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative bg-transparent border border-gray-800 rounded-xl p-8 hover:border-emerald-400 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-l-lg"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FaBriefcase className="text-emerald-400" /> {exp.title}
                    </h3>
                    <p className="text-green-700 text-sm mt-1">{exp.company}</p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-3 sm:mt-0">
                    <FaCalendarAlt className="mr-2 text-emerald-400" />
                    {exp.year}
                  </div>
                </div>

                {/* Services */}
                <ul className="list-disc list-inside text-gray-800 text-sm space-y-1 mb-4">
                  {exp.services?.map((service, i) => (
                    <li key={i} className="hover:text-emerald-400 transition">
                      {service}
                    </li>
                  ))}
                </ul>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenForm(exp)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm px-4 py-2 rounded-lg transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center mx-auto gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-6 py-3 rounded-lg transition"
          >
            <FaPlus /> Add New Experience
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-xl p-8 w-full max-w-lg relative shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-emerald-600">
              {editingExp ? "Edit Experience" : "Add New Experience"}
            </h3>

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Form Fields */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:border-emerald-400 outline-none"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:border-emerald-400 outline-none"
              />
              <input
                type="text"
                placeholder="Year of Service (e.g. 2021 - 2023)"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:border-emerald-400 outline-none"
              />
              <textarea
                placeholder="List of services (one per line)"
                value={formData.services}
                onChange={(e) =>
                  setFormData({ ...formData, services: e.target.value })
                }
                rows="4"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:border-emerald-400 outline-none"
              ></textarea>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-5 py-2 rounded-lg transition"
              >
                {editingExp ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Experience;
