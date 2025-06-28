import { useEffect, useState } from "react";

const NoteList = ({ user, onOpen, refreshFlag }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetched = Object.entries(localStorage)
      .filter(([key]) => key.startsWith(`${user}-note-`))
      .map(([id, value]) => {
        try {
          const parsed = JSON.parse(value);
          return {
            id,
            title: parsed.title || "Untitled",
            cipher: parsed.cipher,
            createdAt: parsed.createdAt,
            tags: parsed.tags || [],
            pinned: parsed.pinned || false,
            color: parsed.color || "#FFE99A",
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    setNotes(fetched);
  }, [user, refreshFlag]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this note?")) {
      localStorage.removeItem(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  return (
    <div className="space-y-2 mt-6 text-white">
      <h2 className="font-bold text-xl">📋 Your Notes</h2>
      {notes.length === 0 && <p className="text-white/70">No notes yet.</p>}
      {notes.map((note) => (
        <div
          key={note.id}
          style={{ backgroundColor: note.color }}
          className="px-4 py-2 rounded-lg shadow-sm text-black"
        >
          <div className="flex justify-between items-center font-medium">
            <button onClick={() => onOpen(note.cipher)} className="w-full text-left">
              {note.pinned ? "📌" : "📝"} {note.title}
            </button>
            <button
              onClick={() => handleDelete(note.id)}
              className="text-red-600 text-sm hover:underline ml-2"
            >
              🗑
            </button>
          </div>
          <p className="text-xs text-gray-600">
            📅 {new Date(note.createdAt).toLocaleString()}
          </p>
          {note.tags.length > 0 && (
            <p className="text-xs italic text-gray-700">
              🏷 {note.tags.join(", ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoteList;
