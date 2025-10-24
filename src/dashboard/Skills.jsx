// components/managers/SkillsManager.jsx
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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { toast, Toaster } from "react-hot-toast";

const SkillsManager = ({ theme = "light", onUpdate }) => {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Technical",
    proficiency: 50,
    icon: "",
    description: "",
    technologies: "",
  });

  const safeTheme = theme === "dark" ? "dark" : "light";

  const categories = ["Technical", "Soft", "Design", "Language", "Framework"];

  // Real-time fetch
  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const skillsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSkills(skillsData);
      if (onUpdate) onUpdate();
    });
    return () => unsubscribe();
  }, [onUpdate]);

  // Add/Edit Skill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading(editingSkill ? "Updating skill..." : "Adding skill...");
      const technologiesArray = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const skillData = {
        name: formData.name,
        category: formData.category,
        proficiency: Number(formData.proficiency),
        icon: formData.icon,
        description: formData.description,
        technologies: technologiesArray,
        updatedAt: serverTimestamp(),
        ...(editingSkill ? {} : { createdAt: serverTimestamp() }),
      };

      if (editingSkill) {
        await updateDoc(doc(db, "skills", editingSkill.id), skillData);
        toast.dismiss();
        toast.success("Skill updated successfully! 🎉");
      } else {
        await addDoc(collection(db, "skills"), skillData);
        toast.dismiss();
        toast.success("Skill added successfully! 🚀");
      }

      setShowForm(false);
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "Technical",
        proficiency: 50,
        icon: "",
        description: "",
        technologies: "",
      });
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.dismiss();
      toast.error("Something went wrong. Please try again!");
    }
  };

  // Delete Skill
  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col space-y-2">
        <p>Are you sure you want to delete this skill?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.promise(deleteDoc(doc(db, "skills", id)), {
                loading: "Deleting skill...",
                success: "Skill deleted successfully! 🗑️",
                error: "Failed to delete skill.",
              });
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Yes, Delete
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

  // Edit Skill
  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "Technical",
      proficiency: skill.proficiency || 50,
      icon: skill.icon || "",
      description: skill.description || "",
      technologies: (skill.technologies || []).join(", "),
    });
    setShowForm(true);
  };

  // Card theme classes
  const cardBg = safeTheme === "dark" ? "bg-zinc-900 text-gray-100 border-zinc-700" : "bg-white text-gray-900 border-gray-200";
  const badgeBg = safeTheme === "dark" ? "bg-zinc-700 text-gray-200" : "bg-blue-100 text-blue-800";
  const inputBg = safeTheme === "dark" ? "bg-zinc-800 text-gray-100 border-zinc-700" : "bg-white text-gray-900 border-gray-300";

  return (
    <div className="relative">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: safeTheme === "dark" ? "#111" : "#fff",
            color: safeTheme === "dark" ? "#fff" : "#000",
            border: `1px solid ${safeTheme === "dark" ? "#16a34a" : "#16a34a"}`,
          },
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Skills</h2>
          <p className="text-sm text-gray-500">Manage your technical and soft skills</p>
        </div>
        <button
          onClick={() => {
            setEditingSkill(null);
            setFormData({
              name: "",
              category: "Technical",
              proficiency: 50,
              icon: "",
              description: "",
              technologies: "",
            });
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Skill
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl p-6 w-full max-w-md shadow-lg ${cardBg}`}>
            <h3 className="text-xl font-bold mb-4">{editingSkill ? "Edit Skill" : "Add New Skill"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description..."
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Proficiency: {formData.proficiency}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{editingSkill ? "Update Skill" : "Add Skill"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className={`rounded-xl border p-6 transition ${cardBg}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {skill.icon && (
                  <span className="text-2xl">
                    {skill.icon.startsWith("http") ? (
                      <img src={skill.icon} alt={skill.name} className="w-8 h-8" />
                    ) : (
                      skill.icon
                    )}
                  </span>
                )}
                <h3 className="font-semibold text-lg">{skill.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${badgeBg}`}>
                {skill.category}
              </span>
            </div>

            {skill.description && (
              <p className="text-sm mb-3 line-clamp-3">{skill.description}</p>
            )}

            {skill.technologies && skill.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skill.technologies.map((tech, idx) => (
                  <span key={idx} className={`px-2 py-1 text-xs rounded-full border ${safeTheme === "dark" ? "bg-zinc-800 text-gray-200 border-zinc-700" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Proficiency</span>
                <span>{skill.proficiency}%</span>
              </div>
              <div className={`w-full rounded-full h-2 ${safeTheme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}>
                <div className="h-2 rounded-full bg-green-600 transition-all duration-300" style={{ width: `${skill.proficiency}%` }}></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => handleEdit(skill)} className="flex-1 py-2 px-3 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700">Edit</button>
              <button onClick={() => handleDelete(skill.id)} className="flex-1 py-2 px-3 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
