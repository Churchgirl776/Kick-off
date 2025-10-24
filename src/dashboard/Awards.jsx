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
import { toast, Toaster } from "react-hot-toast";

const Awards = ({ theme = "light" }) => {
  const [awards, setAwards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [formData, setFormData] = useState({
    icon: "",
    year: "",
    title: "",
    description: "",
  });

  // 🔄 Real-time listener
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
    const { icon, year, title, description } = formData;
    if (!year || !title) {
      toast.error("Please fill in at least Year and Title.");
      return;
    }
    const toastId = toast.loading(
      editingAward ? "Updating award..." : "Adding award..."
    );
    try {
      const awardData = {
        icon,
        year,
        title,
        description,
        createdAt: serverTimestamp(),
      };

      if (editingAward) {
        await updateDoc(doc(db, "awards", editingAward.id), awardData);
        toast.success("Award updated successfully 🎉", { id: toastId });
      } else {
        await addDoc(collection(db, "awards"), awardData);
        toast.success("Award added successfully 🏆", { id: toastId });
      }

      setShowForm(false);
      setEditingAward(null);
      setFormData({ icon: "", year: "", title: "", description: "" });
    } catch (error) {
      console.error("Error saving award:", error);
      toast.error("Error saving award ❌", { id: toastId });
    }
  };

  // 🗑️ Delete Award
  const handleDelete = async (id) => {
    toast((t) => (
      <div className={theme === "dark" ? "text-white" : ""}>
        <p className="text-sm font-medium mb-2">
          Are you sure you want to delete this award?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const deletingToast = toast.loading("Deleting award...");
              try {
                await deleteDoc(doc(db, "awards", id));
                toast.success("Award deleted successfully 🗑️", {
                  id: deletingToast,
                });
              } catch (err) {
                console.error("Error deleting award:", err);
                toast.error("Error deleting award ❌", { id: deletingToast });
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

  const bgMain = theme === "dark" ? "bg-zinc-900 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardBg = theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200";
  const modalBg = theme === "dark" ? "bg-zinc-900 text-gray-100" : "bg-white text-gray-900";
  const inputBg = theme === "dark" ? "bg-zinc-700 text-gray-100 border-zinc-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500";

  return (
    <section className={`py-10 px-6 md:px-12 min-h-screen ${bgMain}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === "dark" ? "#111" : "#fff",
            color: theme === "dark" ? "#fff" : "#111",
            border: theme === "dark" ? "1px solid #555" : "1px solid #e5e7eb",
          },
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Awards</h2>
          <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
            Manage your recognitions & achievements
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAward(null);
            setFormData({ icon: "", year: "", title: "", description: "" });
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
          <div className={`rounded-xl p-6 w-full max-w-md shadow-lg ${modalBg}`}>
            <h3 className="text-xl font-bold mb-4">
              {editingAward ? "Edit Award" : "Add New Award"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["icon","year","title","description"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                  {field === "description" ? (
                    <textarea
                      value={formData[field]}
                      onChange={(e) => setFormData({...formData,[field]: e.target.value})}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                    />
                  ) : (
                    <input
                      type={field==="year"?"number":"text"}
                      value={formData[field]}
                      onChange={(e) => setFormData({...formData,[field]: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                      placeholder={field==="icon"?"🏆 or https://...":undefined}
                      required={field==="year" || field==="title"}
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingAward(null); }}
                  className={`px-4 py-2 rounded-lg border hover:bg-gray-50 ${theme==="dark"?"border-zinc-600":"border-gray-300"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            className={`rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border ${cardBg}`}
          >
            <div className="flex items-center space-x-4 mb-3">
              {award.icon && (
                <span className="text-3xl">
                  {award.icon.startsWith("http") ? (
                    <img src={award.icon} alt={award.title} className="w-10 h-10" />
                  ) : award.icon}
                </span>
              )}
              <div>
                <h3 className={`font-semibold text-lg ${theme==="dark"?"text-gray-100":"text-gray-900"}`}>{award.title}</h3>
                <p className={theme==="dark"?"text-gray-400":"text-gray-500"}>{award.year}</p>
              </div>
            </div>
            {award.description && <p className={theme==="dark"?"text-gray-300":"text-gray-600"}>{award.description}</p>}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => { setEditingAward(award); setFormData(award); setShowForm(true); }}
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
