import React, { useEffect, useState } from "react";
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

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [formData, setFormData] = useState({
    icon: "",
    year: "",
    title: "",
    description: "",
  });

  // 🔄 Real-time listener for awards
  useEffect(() => {
    const q = query(collection(db, "awards"), orderBy("year", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAwards(data);
    });
    return () => unsubscribe();
  }, []);

  // 💾 Add / Update Award
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const awardData = {
        ...formData,
        createdAt: serverTimestamp(),
      };

      if (editingAward) {
        // Update
        await updateDoc(doc(db, "awards", editingAward.id), awardData);
      } else {
        // Add new
        await addDoc(collection(db, "awards"), awardData);
      }

      // Reset
      setShowForm(false);
      setEditingAward(null);
      setFormData({
        icon: "",
        year: "",
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving award:", error);
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this award?")) {
      try {
        await deleteDoc(doc(db, "awards", id));
      } catch (error) {
        console.error("Error deleting award:", error);
      }
    }
  };

  return (
    <section className="py-10 px-6 md:px-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Awards</h2>
          <p className="text-gray-600">Manage your recognitions & achievements</p>
        </div>
        <button
          onClick={() => {
            setEditingAward(null);
            setFormData({
              icon: "",
              year: "",
              title: "",
              description: "",
            });
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Award
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingAward ? "Edit Award" : "Add New Award"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (emoji or URL)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="🏆 or https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Best UI/UX Designer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief details about this award..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAward(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingAward ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Awards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award) => (
          <div
            key={award.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-4 mb-3">
              {award.icon && (
                <span className="text-3xl">
                  {award.icon.startsWith("http") ? (
                    <img
                      src={award.icon}
                      alt={award.title}
                      className="w-10 h-10"
                    />
                  ) : (
                    award.icon
                  )}
                </span>
              )}
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {award.title}
                </h3>
                <p className="text-gray-500 text-sm">{award.year}</p>
              </div>
            </div>

            {award.description && (
              <p className="text-gray-600 text-sm mb-4">{award.description}</p>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingAward(award);
                  setFormData(award);
                  setShowForm(true);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(award.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Awards;
