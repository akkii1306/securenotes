// const NoteList = ({notes, onSelect})=> (
//     <div className="p-4">
//         {notes.map((n,idx)=>(
//             <button key={idx} onClick={()=>
//                 onSelect(n)} className="block p-2 bg-gray-100 w-full mb-2 text-left rounded">
//                     Note{idx+1}
//                 </button>
//         ))}
//     </div>
// );
import { useState, useEffect } from "react";

const NoteList = ({ onOpen }) => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const allNotes = Object.entries(localStorage)
      .filter(([key]) => key.startsWith("note-"))
      .map(([key, value]) => {
        try {
          const { title, cipher } = JSON.parse(value);
          return { id: key, title, cipher };
        } catch {
          return null; // skip corrupted notes
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.id.localeCompare(a.id));

    setNotes(allNotes);
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      localStorage.removeItem(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">🗂 Saved Notes</h2>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {filteredNotes.length === 0 && (
        <p className="text-sm text-gray-500">No matching notes found.</p>
      )}

      {filteredNotes.map((note) => (
        <div
          key={note.id}
          className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
        >
          <button
            className="text-left w-full text-sm font-medium"
            onClick={() => onOpen(note.cipher)}
          >
            📝 {note.title}
          </button>
          <button
            onClick={() => handleDelete(note.id)}
            className="text-red-600 text-sm ml-4 hover:underline"
          >
            🗑 Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
