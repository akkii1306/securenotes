import { useState, useEffect } from "react";
import Editor from "./components/Editor";
import NoteList from "./components/NoteList";
import NoteView from "./pages/NoteView";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackupManager from "./components/BackupManager";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [selected, setSelected] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false); // trigger note list refresh

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setSelected(null);
  };

  const handleNoteSave = () => {
    setRefreshFlag(!refreshFlag); // refresh NoteList
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-purple-700">SecureNotes</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      <Editor onSave={handleNoteSave} user={user} />
      <NoteList onOpen={setSelected} user={user} refreshFlag={refreshFlag} />
      <BackupManager user={user} onRefresh={() => setRefreshFlag(!refreshFlag)} />
      {selected && <NoteView cipher={selected} />}
      <ToastContainer />
    </div>
  );
};

export default App;
