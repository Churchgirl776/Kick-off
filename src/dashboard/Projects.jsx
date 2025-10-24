import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { FiEdit, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

const Projects = ({ theme = "light", onUpdate }) => {
  const safeOnUpdate = typeof onUpdate === "function" ? onUpdate : () => {};

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "On track",
    progress: "",
    date: "",
    owner: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    role: "",
    duration: "",
    tools: "",
    results: "",
    gallery: [""],
    stages: [""],
  });

  // Fetch projects
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamic array field changes
  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSaveProject = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Please fill in the required fields: Name and Description.");
      return;
    }

    setSaving(true);
    const formattedData = {
      ...formData,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gallery: formData.gallery.filter((g) => g.trim() !== ""),
      stages: formData.stages.filter((s) => s.trim() !== ""),
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "projects", editId), {
          ...formattedData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "projects"), {
          ...formattedData,
          createdAt: serverTimestamp(),
        });
      }

      setShowModal(false);
      setEditId(null);
      resetForm();
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Error saving project. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "On track",
      progress: "",
      date: "",
      owner: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
      role: "",
      duration: "",
      tools: "",
      results: "",
      gallery: [""],
      stages: [""],
    });
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "On track",
      progress: project.progress || "",
      date: project.date || "",
      owner: project.owner || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      imageUrl: project.imageUrl || "",
      role: project.role || "",
      duration: project.duration || "",
      tools: project.tools || "",
      results: project.results || "",
      gallery: project.gallery?.length ? project.gallery : [""],
      stages: project.stages?.length ? project.stages : [""],
    });
    setEditId(project.id);
    setShowModal(true);
  };

  const styles =
    theme === "dark"
      ? {
          container: "bg-zinc-900 border-zinc-700 text-gray-100",
          header: "bg-zinc-800 border-zinc-700 text-gray-100",
          row: "hover:bg-zinc-800",
          input: "bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-400",
          modal: "bg-zinc-900 text-gray-100",
          buttonCancel: "bg-gray-600 hover:bg-gray-700 text-white",
          buttonSave: "bg-green-600 hover:bg-green-700 text-white",
        }
      : {
          container: "bg-white border-gray-200 text-gray-900",
          header: "bg-gray-50 border-gray-200 text-gray-700",
          row: "hover:bg-gray-50",
          input: "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500",
          modal: "bg-white text-gray-900",
          buttonCancel: "bg-gray-200 hover:bg-gray-300 text-gray-900",
          buttonSave: "bg-green-600 hover:bg-green-700 text-white",
        };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-gray-400">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Project
        </button>
      </div>

      {/* Project List */}
      {loading ? (
        <div
          className={`p-6 rounded-xl shadow text-center ${styles.container}`}
        >
          Loading projects...
        </div>
      ) : (
        <div
          className={`rounded-xl shadow-sm border overflow-hidden ${styles.container}`}
        >
          <div
            className={`grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-sm ${styles.header}`}
          >
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-700">
            {projects.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 transition ${styles.row}`}
                >
                  <div className="col-span-4">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm opacity-75 truncate">
                      {project.description}
                    </div>
                  </div>
                  <div className="col-span-2 text-sm opacity-75">
                    {project.status}
                  </div>
                  <div className="col-span-2 text-sm opacity-75">
                    {project.progress}
                  </div>
                  <div className="col-span-2 text-sm opacity-75">
                    {project.date}
                  </div>
                  <div className="col-span-2 flex justify-end items-center gap-3">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div
            className={`rounded-xl shadow-lg p-6 w-full max-w-lg relative ${styles.modal}`}
          >
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Edit Project" : "Add New Project"}
            </h3>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {/* Basic fields */}
              {[
                { name: "name", placeholder: "Project Name *" },
                { name: "description", placeholder: "Project Description *", textarea: true },
                { name: "status", placeholder: "Status" },
                { name: "progress", placeholder: "Progress" },
                { name: "date", placeholder: "Date", type: "date" },
                { name: "owner", placeholder: "Owner" },
                { name: "role", placeholder: "Role (e.g. Designer, Developer)" },
                { name: "duration", placeholder: "Duration (e.g. 6 weeks)" },
                { name: "tools", placeholder: "Tools (comma separated)" },
                { name: "results", placeholder: "Results / Impact" },
                { name: "technologies", placeholder: "Technologies (comma separated)" },
                { name: "imageUrl", placeholder: "Main Image URL" },
              ].map((field) =>
                field.textarea ? (
                  <textarea
                    key={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full p-2 rounded border transition ${styles.input}`}
                  />
                ) : (
                  <input
                    key={field.name}
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full p-2 rounded border transition ${styles.input}`}
                  />
                )
              )}

              {/* Dynamic Gallery Input */}
              <div>
                <h4 className="font-medium mb-1 text-green-500">
                  Gallery Images
                </h4>
                {formData.gallery.map((img, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) =>
                        handleArrayChange("gallery", index, e.target.value)
                      }
                      placeholder="Image URL"
                      className={`flex-1 p-2 rounded border ${styles.input}`}
                    />
                    <button
                      onClick={() => removeArrayItem("gallery", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiMinus />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("gallery")}
                  className="flex items-center text-sm text-green-500 hover:text-green-400"
                >
                  <FiPlus className="mr-1" /> Add Image
                </button>
              </div>

              {/* Dynamic Stages Input */}
              <div>
                <h4 className="font-medium mb-1 text-green-500">
                  Project Stages / Milestones
                </h4>
                {formData.stages.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) =>
                        handleArrayChange("stages", index, e.target.value)
                      }
                      placeholder="Stage description"
                      className={`flex-1 p-2 rounded border ${styles.input}`}
                    />
                    <button
                      onClick={() => removeArrayItem("stages", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiMinus />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("stages")}
                  className="flex items-center text-sm text-green-500 hover:text-green-400"
                >
                  <FiPlus className="mr-1" /> Add Stage
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
                className={`px-4 py-2 rounded-lg transition ${styles.buttonCancel}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className={`px-4 py-2 rounded-lg transition ${styles.buttonSave} disabled:opacity-50`}
              >
                {saving
                  ? editId
                    ? "Updating..."
                    : "Saving..."
                  : editId
                  ? "Update Project"
                  : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
