// components/managers/ProjectsManager.jsx
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
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

const Projects = ({ onUpdate }) => {
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
  });

  // ✅ Fetch all projects in real-time
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProjects(data);
        setLoading(false);
      },
      (error) => {
        toast.error("Error fetching projects ❌");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or update project
  const handleSaveProject = async () => {
    const { name, description } = formData;
    if (!name.trim() || !description.trim()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      editId ? "Updating project..." : "Saving project..."
    );

    try {
      if (editId) {
        const projectRef = doc(db, "projects", editId);
        await updateDoc(projectRef, {
          ...formData,
          technologies: formData.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          updatedAt: serverTimestamp(),
        });
        toast.success("Project updated successfully ✅", { id: toastId });
      } else {
        await addDoc(collection(db, "projects"), {
          ...formData,
          technologies: formData.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          createdAt: serverTimestamp(),
        });
        toast.success("Project added successfully 🚀", { id: toastId });
      }

      // Reset form
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
      });
      setEditId(null);
      setShowModal(false);
    } catch (err) {
      toast.error("Error saving project ❌", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete project with confirmation toast
  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="text-sm font-medium mb-2">
          Are you sure you want to delete this project?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const deletingToast = toast.loading("Deleting project...");
              try {
                await deleteDoc(doc(db, "projects", id));
                toast.success("Project deleted successfully 🗑️", {
                  id: deletingToast,
                });
              } catch {
                toast.error("Failed to delete project ❌", { id: deletingToast });
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

  // ✅ Edit existing project
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
    });
    setEditId(project.id);
    setShowModal(true);
  };

  return (
    <div>
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
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
            });
            setShowModal(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Project
        </button>
      </div>

      {/* Project List */}
      {loading ? (
        <div className="p-6 bg-white rounded-xl shadow text-center">
          Loading projects...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900">
                      {project.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {project.description}
                    </div>
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {project.status}
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {project.progress}
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {project.date}
                  </div>
                  <div className="col-span-2 flex justify-end items-center gap-3">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Project"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Project"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editId ? "Edit Project" : "Add New Project"}
            </h3>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {[
                { name: "name", placeholder: "Project Name *" },
                {
                  name: "description",
                  placeholder: "Project Description *",
                  textarea: true,
                },
                { name: "status", placeholder: "Status" },
                { name: "progress", placeholder: "Progress" },
                { name: "date", placeholder: "Date", type: "date" },
                { name: "owner", placeholder: "Owner" },
                {
                  name: "technologies",
                  placeholder: "Technologies (comma-separated)",
                },
                { name: "liveUrl", placeholder: "Live URL" },
                { name: "githubUrl", placeholder: "GitHub URL" },
                { name: "imageUrl", placeholder: "Image URL" },
              ].map((field) =>
                field.textarea ? (
                  <textarea
                    key={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                ) : (
                  <input
                    key={field.name}
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                )
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
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
