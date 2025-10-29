import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import { FiTrash2, FiCheckCircle } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";

const Responses = () => {
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const RESPONSES_COLLECTION = "responses"; // Make sure this matches your Firestore collection

  // Fetch messages in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, RESPONSES_COLLECTION),
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(
          fetchedMessages.sort(
            (a, b) =>
              (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
          )
        );
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
      await deleteDoc(doc(db, RESPONSES_COLLECTION, id));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, RESPONSES_COLLECTION, id), { read: true });
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div
      className={`min-h-screen px-4 sm:px-8 md:px-16 py-10 transition-colors duration-500 ${
        darkMode ? "bg-[#0a0a0f] text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toaster position="top-right" />
      <motion.h1
        className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${
          darkMode ? "text-gray-100" : "text-gray-800"
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
        <p className="text-center text-gray-400 mt-20 text-lg">
          Loading messages...
        </p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-400 mt-20 text-lg">
          No messages yet.
        </p>
      ) : (
        <motion.div
          className={`overflow-x-auto rounded-2xl shadow-lg transition-all duration-500 ${
            darkMode
              ? "bg-gray-900/70 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <table className="min-w-full border-collapse">
            <thead>
              <tr
                className={`text-left text-sm uppercase tracking-wider ${
                  darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                }`}
              >
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <motion.tr
                  key={msg.id}
                  className={`border-b transition-colors duration-500 ${
                    darkMode
                      ? msg.read
                        ? "bg-gray-800/60 text-gray-400"
                        : "bg-gray-900/50 hover:bg-gray-800/90 text-gray-100"
                      : msg.read
                      ? "bg-gray-100 text-gray-600"
                      : "bg-white hover:bg-gray-50 text-gray-800"
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="py-4 px-6 font-medium">{msg.name || "—"}</td>
                  <td className="py-4 px-6">{msg.email || "—"}</td>
                  <td className="py-4 px-6 max-w-xs sm:max-w-sm md:max-w-md truncate">
                    {msg.message || "—"}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {msg.timestamp
                      ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-4 px-6 flex justify-center gap-2">
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      disabled={msg.read}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        msg.read ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
                      }`}
                    >
                      <FiCheckCircle
                        className={`text-2xl ${
                          msg.read
                            ? "text-gray-400"
                            : "text-green-400 hover:text-green-500"
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 hover:scale-110 transition-all duration-300"
                    >
                      <FiTrash2 className="text-2xl text-red-500 hover:text-red-600" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default Responses;
