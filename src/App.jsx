import { useState } from "react";
import Editor from "./components/Editor";
import NoteList from "./components/NoteList";
import NoteView from "./pages/NoteView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(false); // triggers NoteList to reload

  const handleSave = () => {
    setRefresh((prev) => !prev); // toggle to force NoteList re-render
  };

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-purple-700 text-center">🔐 SecureNotes</h1>

      {!selected ? (
        <>
          <Editor onSave={handleSave} />
          <NoteList key={refresh} onOpen={setSelected} />
        </>
      ) : (
        <NoteView cipher={selected} onBack={() => setSelected(null)} />
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
