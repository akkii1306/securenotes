import { useState, useEffect } from "react";
import Editor from "./Editor";
import NoteList from "./NoteList";
import NoteView from "../pages/NoteView";
import BackupManager from "./BackupManager";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedApp = ({ user, onLogout }) => {
  const [selectedCipher, setSelectedCipher] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // 🕒 AUTO LOGOUT (5 min)
  useEffect(() => {
    if (!user) return;

    const timeout = 5 * 60 * 1000;
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("user");
        onLogout();
        toast.info("Logged out due to inactivity.");
      }, timeout);
    };

    const activityEvents = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [user, onLogout]);

  const refreshNotes = () => setRefreshFlag((prev) => !prev);

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen bg-gray-50">
      {/* 🔐 Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-purple-700">SecureNotes</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">👋 {user}</span>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              onLogout();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ✍️ Note Editor */}
      <Editor
        user={user}
        onSave={refreshNotes}
        editNote={editingNote}
        isEditing={editMode}
        onEditDone={() => {
          setEditMode(false);
          setEditingNote(null);
        }}
      />

      {/* 🗂️ Notes List */}
      <NoteList
        user={user}
        onOpen={(cipher, id) => {
          setSelectedCipher(cipher);
          setSelectedNoteId(id);
        }}
        refreshFlag={refreshFlag}
      />

      {/* 🔄 Backup */}
      <BackupManager user={user} onRefresh={refreshNotes} />

      {/* 🔍 View Note */}
      {selectedCipher && (
        <NoteView
          cipher={selectedCipher}
          onEdit={(noteData) => {
            setEditMode(true);
            setEditingNote(noteData);
            setSelectedCipher(null);
          }}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ProtectedApp;
