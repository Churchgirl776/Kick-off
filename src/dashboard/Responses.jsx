import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import { FiTrash2, FiCheckCircle, FiSend } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const ResponsesManager = ({ theme = "light" }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLLECTION_NAME = "contactResponses";
  const FEEDBACK_COLLECTION = "feedbacks";

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        list.sort(
          (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );
        setResponses(list);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), { read: true });
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handlePostFeedback = async (msg) => {
    try {
      await addDoc(collection(db, FEEDBACK_COLLECTION), {
        name: msg.name || "Anonymous",
        message: msg.message || "",
        timestamp: serverTimestamp(),
        approved: true,
      });
      toast.success("Feedback posted to portfolio");
    } catch (error) {
      console.error("Error posting feedback:", error);
      toast.error("Failed to post feedback");
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 md:px-10 py-10 transition-colors duration-500 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toaster position="top-right" />
      <motion.h1
        className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center ${
          isDark ? "text-gray-100" : "text-gray-800"
        }`}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Admin Dashboard —{" "}
        <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
          Contact Responses
        </span>
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-400 mt-20 text-lg">Loading messages...</p>
      ) : responses.length === 0 ? (
        <p className="text-center text-gray-400 mt-20 text-lg">No responses yet.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg transition-all duration-500">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr
                  className={`text-left text-sm sm:text-base uppercase tracking-wider ${
                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <th className="py-3 px-4 sm:px-6">Name</th>
                  <th className="py-3 px-4 sm:px-6">Email</th>
                  <th className="py-3 px-4 sm:px-6">Message</th>
                  <th className="py-3 px-4 sm:px-6">Date & Time</th>
                  <th className="py-3 px-4 sm:px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`border-b transition-colors duration-500 ${
                      isDark
                        ? msg.read
                          ? "bg-gray-700/60 text-gray-400"
                          : "bg-gray-800/50 hover:bg-gray-700/90 text-gray-100"
                        : msg.read
                        ? "bg-gray-100 text-gray-600"
                        : "bg-white hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <td className="py-3 px-4 sm:px-6 font-medium break-words max-w-[150px] sm:max-w-xs">
                      {msg.name || "—"}
                    </td>
                    <td className="py-3 px-4 sm:px-6 break-words max-w-[150px] sm:max-w-xs">
                      {msg.email || "—"}
                    </td>
                    <td className="py-3 px-4 sm:px-6 break-words max-w-[200px] sm:max-w-md">
                      {msg.message || "—"}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-sm">
                      {msg.timestamp
                        ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-3 px-4 sm:px-6 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        disabled={msg.read}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          msg.read ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
                        }`}
                      >
                        <FiCheckCircle
                          className={`text-2xl ${
                            msg.read ? "text-gray-400" : "text-green-400 hover:text-green-500"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 hover:scale-110 transition-all duration-300"
                      >
                        <FiTrash2 className="text-2xl text-red-500 hover:text-red-600" />
                      </button>
                      <button
                        onClick={() => handlePostFeedback(msg)}
                        className="p-2 hover:scale-110 transition-all duration-300"
                      >
                        <FiSend className="text-2xl text-green-500 hover:text-green-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {responses.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl shadow-md transition-all duration-300 ${
                  isDark
                    ? msg.read
                      ? "bg-gray-700/60 text-gray-400"
                      : "bg-gray-800/50 hover:bg-gray-700/90 text-gray-100"
                    : msg.read
                    ? "bg-gray-100 text-gray-600"
                    : "bg-white hover:bg-gray-50 text-gray-800"
                }`}
              >
                <p className="font-semibold text-lg">{msg.name || "—"}</p>
                <p className="text-sm break-words">{msg.email || "—"}</p>
                <p className="mt-2 break-words">{msg.message || "—"}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {msg.timestamp
                    ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                    : "—"}
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    disabled={msg.read}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      msg.read ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
                    }`}
                  >
                    <FiCheckCircle
                      className={`text-xl ${
                        msg.read ? "text-gray-400" : "text-green-400 hover:text-green-500"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 hover:scale-110 transition-all duration-300"
                  >
                    <FiTrash2 className="text-xl text-red-500 hover:text-red-600" />
                  </button>
                  <button
                    onClick={() => handlePostFeedback(msg)}
                    className="p-2 hover:scale-110 transition-all duration-300"
                  >
                    <FiSend className="text-xl text-green-500 hover:text-green-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResponsesManager;
