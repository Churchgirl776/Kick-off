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
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

function Projects({ theme = "light", onUpdate }) {
  const safeOnUpdate = typeof onUpdate === "function" ? onUpdate : () => {};

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expanded, setExpanded] = useState({});
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

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProjects(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetForm = () =>
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      safeOnUpdate();
    } catch (err) {
      console.error(err);
      alert("Delete failed. See console.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const copy = [...formData[field]];
    copy[index] = value;
    setFormData((p) => ({ ...p, [field]: copy }));
  };

  const addArrayItem = (field) =>
    setFormData((p) => ({ ...p, [field]: [...p[field], ""] }));

  const removeArrayItem = (field, idx) => {
    const copy = [...formData[field]];
    copy.splice(idx, 1);
    setFormData((p) => ({ ...p, [field]: copy }));
  };

  const handleSaveProject = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Please fill Name and Description.");
      return;
    }
    setSaving(true);
    const formatted = {
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
          ...formatted,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "projects"), {
          ...formatted,
          createdAt: serverTimestamp(),
        });
      }
      setShowModal(false);
      setEditId(null);
      resetForm();
      safeOnUpdate();
    } catch (err) {
      console.error(err);
      alert("Save failed. See console.");
    } finally {
      setSaving(false);
    }
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

  const toggleExpand = (id) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const styles =
    theme === "dark"
      ? {
          container: "bg-zinc-900 border-zinc-700 text-gray-100",
          header: "bg-zinc-800 text-gray-100",
          rowHover: "hover:bg-zinc-800",
          input:
            "bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-400",
          modal: "bg-zinc-900 text-gray-100",
          btnCancel: "bg-gray-600 hover:bg-gray-700 text-white",
          btnSave: "bg-green-600 hover:bg-green-700 text-white",
        }
      : {
          container: "bg-white border-gray-200 text-gray-900",
          header: "bg-gray-50 text-gray-700",
          rowHover: "hover:bg-gray-50",
          input:
            "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500",
          modal: "bg-white text-gray-900",
          btnCancel: "bg-gray-200 hover:bg-gray-300 text-gray-900",
          btnSave: "bg-green-600 hover:bg-green-700 text-white",
        };

  return (
    <div className="w-full p-4 sm:p-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-gray-500">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          + Add Project
        </button>
      </div>

      {/* Desktop Table */}
      <div
        className={`hidden lg:block rounded-xl shadow-sm border overflow-hidden ${styles.container}`}
      >
        <div className="overflow-x-auto">
          <div
            className={`min-w-[700px] grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-sm ${styles.header}`}
          >
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-zinc-700">
            {loading ? (
              <div className="p-6 text-center">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`min-w-[700px] grid grid-cols-12 gap-4 px-6 py-4 transition ${styles.rowHover}`}
                >
                  <div className="col-span-4">
                    <div className="font-medium truncate">{project.name}</div>
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
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <div className={`p-4 rounded-xl shadow ${styles.container}`}>
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className={`p-4 text-center rounded-xl ${styles.container}`}>
            No projects found.
          </div>
        ) : (
          projects.map((project) => {
            const isOpen = !!expanded[project.id];
            return (
              <div
                key={project.id}
                className={`rounded-xl shadow-md border ${styles.container} overflow-hidden transition-transform duration-200 hover:scale-[1.01]`}
              >
                {/* Card Header */}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="text-left">
                    <div className="font-semibold text-base break-words">
                      {project.name}
                    </div>
                    <div className="text-sm text-gray-400 line-clamp-2">
                      {project.description}
                    </div>
                  </div>
                  <div className="ml-3 flex flex-col items-end">
                    <span className="text-sm text-gray-500">
                      {project.progress || project.status}
                    </span>
                    <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </button>

                {/* Expanded Card */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 text-sm space-y-2 border-t border-gray-200 dark:border-zinc-700">
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {project.status}
                    </div>
                    {project.progress && (
                      <div>
                        <span className="font-medium">Progress:</span>{" "}
                        {project.progress}
                      </div>
                    )}
                    {project.date && (
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {project.date}
                      </div>
                    )}
                    {project.owner && (
                      <div>
                        <span className="font-medium">Owner:</span>{" "}
                        {project.owner}
                      </div>
                    )}
                    {project.technologies && (
                      <div>
                        <span className="font-medium">Tech:</span>{" "}
                        {Array.isArray(project.technologies)
                          ? project.technologies.join(", ")
                          : project.technologies}
                      </div>
                    )}
                    {project.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          className="rounded-lg w-full h-40 object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 pt-3">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div
            className={`rounded-xl shadow-lg p-5 w-full max-w-3xl ${styles.modal}`}
          >
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Edit Project" : "Add New Project"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Project Name *"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description *"
                  rows={4}
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <input
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Status"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <input
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  placeholder="Progress"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
              </div>

              <div className="space-y-3">
                <input
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  placeholder="Owner"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Role"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Duration"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <input
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="Technologies (comma separated)"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className={`w-full p-2 rounded border ${styles.input}`}
                />
              </div>

              <div className="md:col-span-2">
                <h4 className="font-medium mb-2">Gallery Images</h4>
                <div className="space-y-2">
                  {formData.gallery.map((g, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={g}
                        onChange={(e) =>
                          handleArrayChange("gallery", i, e.target.value)
                        }
                        className={`flex-1 p-2 rounded border ${styles.input}`}
                        placeholder="Image URL"
                      />
                      <button
                        onClick={() => removeArrayItem("gallery", i)}
                        className="text-red-500 hover:text-red-700 mt-1"
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
              </div>

              <div className="md:col-span-2">
                <h4 className="font-medium mb-2">Project Stages</h4>
                <div className="space-y-2">
                  {formData.stages.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={s}
                        onChange={(e) =>
                          handleArrayChange("stages", i, e.target.value)
                        }
                        className={`flex-1 p-2 rounded border ${styles.input}`}
                        placeholder="Stage description"
                      />
                      <button
                        onClick={() => removeArrayItem("stages", i)}
                        className="text-red-500 hover:text-red-700 mt-1"
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
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
                className={`px-4 py-2 rounded ${styles.btnCancel}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className={`px-4 py-2 rounded ${styles.btnSave} disabled:opacity-50`}
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
}

export default Projects;
