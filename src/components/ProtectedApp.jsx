import { useState, useEffect } from "react";
import "../styles/stars.css";
import Editor from "./Editor";
import NoteList from "./NoteList";
import BackupManager from "./BackupManager";
import NoteView from "../pages/NoteView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedApp = ({ user, onLogout }) => {
  const [selectedCipher, setSelectedCipher] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState("create");

  // Auto logout
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

    const events = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timer);
    };
  }, [user, onLogout]);

  // ✨ Star Generator
  useEffect(() => {
    const container = document.querySelector(".starry-bg");
    if (!container) return;
    container.innerHTML = "";
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(star);
    }
    return () => {
      container.innerHTML = "";
    };
  }, []);

  const refreshNotes = () => setRefreshFlag((prev) => !prev);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-white bg-transparent">
      {/* 🌌 Starry Background */}
      <div className="starry-bg" />

      {/* 🔐 Header */}
      <header className="flex justify-between items-center px-6 py-4 z-10 relative">
        <h1 className="text-3xl font-bold text-purple-200">SecureNotes</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">👋 {user}</span>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              onLogout();
            }}
            className="button-29"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🔍 Section Selector Cards */}
      <main className="relative z-10 px-4 md:px-10 py-10 flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 gap-8 mt-4 max-w-5xl w-full">
          <div
            onClick={() => setActiveSection("create")}
            className={`cursor-pointer transition duration-300 p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:scale-105 ${
              activeSection === "create" ? "ring-2 ring-purple-400" : ""
            }`}
          >
            <h2 className="text-xl font-bold mb-2">✍️ Create a New Note</h2>
            <p className="text-sm text-white/80">
              Start writing an encrypted note with your own secure password.
            </p>
          </div>

          <div
            onClick={() => setActiveSection("saved")}
            className={`cursor-pointer transition duration-300 p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:scale-105 ${
              activeSection === "saved" ? "ring-2 ring-purple-400" : ""
            }`}
          >
            <h2 className="text-xl font-bold mb-2">📁 Saved Notes</h2>
            <p className="text-sm text-white/80">
              Browse, decrypt, or manage your existing secure notes.
            </p>
          </div>
        </div>

        {/* ✨ Active Section Content */}
        <div className="w-full max-w-5xl mt-10 space-y-6">
          {activeSection === "create" && (
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
          )}

          {activeSection === "saved" && (
            <>
              <NoteList
                user={user}
                onOpen={(cipher, id) => {
                  setSelectedCipher(cipher);
                  setSelectedNoteId(id);
                }}
                refreshFlag={refreshFlag}
              />

              {selectedCipher && (
                <NoteView
                  cipher={selectedCipher}
                  onEdit={(noteData) => {
                    setEditMode(true);
                    setEditingNote(noteData);
                    setActiveSection("create");
                    setSelectedCipher(null);
                  }}
                />
              )}

              <BackupManager user={user} onRefresh={refreshNotes} />
            </>
          )}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
};

export default ProtectedApp;
