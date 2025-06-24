import { useState, useEffect } from "react";

const NoteList = ({ user, onOpen, refreshFlag }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const userNotes = Object.entries(localStorage)
      .filter(([key]) => key.startsWith(`${user}-note-`))
      .map(([key, value]) => {
        const { title } = JSON.parse(value);
        return { id: key, title, cipher: JSON.parse(value).cipher };
      });

    setNotes(userNotes);
  }, [user, refreshFlag]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this note?");
    if (confirmDelete) {
      localStorage.removeItem(id);
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <h2 className="text-lg font-semibold">Your Notes</h2>
      {notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}
      {notes.map((note) => (
        <div key={note.id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
          <button
            onClick={() => onOpen(note.cipher)}
            className="text-left w-full text-sm font-medium"
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
