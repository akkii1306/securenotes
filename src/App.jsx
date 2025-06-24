import { useState, useEffect } from "react";
import Editor from "./components/Editor";
import NoteList from "./components/NoteList";
import NoteView from "./pages/NoteView";
import Login from "./pages/Login";
import BackupManager from "./components/BackupManager";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
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
        setUser(null);
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
  }, [user]);

  if (!user) return <Login onLogin={setUser} />;

  const refreshNotes = () => setRefreshFlag((prev) => !prev);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">SecureNotes</h1>

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

      <NoteList
        user={user}
        onOpen={(cipher, id) => {
          setSelectedCipher(cipher);
          setSelectedNoteId(id);
        }}
        refreshFlag={refreshFlag}
      />

      <BackupManager user={user} onRefresh={refreshNotes} />

      {selectedCipher && (
        <NoteView
  cipher={selectedCipher}
  onEdit={(noteData) => {
    setEditMode(true);
    setEditingNote(noteData);
    setSelectedCipher(null); // hide view once editing starts
  }}
/>

      )}

      <ToastContainer />
    </div>
  );
};

export default App;
