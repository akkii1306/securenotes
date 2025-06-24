import { useState, useEffect } from "react";
import Editor from "./components/Editor";
import NoteList from "./components/NoteList";
import NoteView from "./pages/NoteView";
import Login from "./pages/Login";
import BackupManager from "./components/BackupManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [selectedCipher, setSelectedCipher] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  if (!user) return <Login onLogin={setUser} />;

  const handleSave = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">SecureNotes</h1>

      <Editor user={user} onSave={handleSave} />
      <NoteList
        user={user}
        onOpen={setSelectedCipher}
        refreshFlag={refreshFlag}
      />
      <BackupManager user={user} onRefresh={() => setRefreshFlag(!refreshFlag)} />

      {selectedCipher && <NoteView cipher={selectedCipher} />}
      <ToastContainer />
    </div>
  );
};

export default App;
