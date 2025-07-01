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
    <div className="mt-6 text-white w-full px-2 sm:px-4 max-w-4xl mx-auto">
      <h2 className="font-bold text-xl mb-3">📋 Your Notes</h2>

      {notes.length === 0 && (
        <p className="text-white/70 text-center">No notes yet.</p>
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            style={{ backgroundColor: note.color }}
            className="p-4 rounded-lg shadow-md text-black break-words"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center font-medium gap-2">
              <button
                onClick={() => onOpen(note.cipher)}
                className="text-left w-full sm:w-auto sm:flex-1"
              >
                {note.pinned ? "📌" : "📝"} {note.title}
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-600 text-sm hover:underline"
              >
                🗑 Delete
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-1">
              📅 {new Date(note.createdAt).toLocaleString()}
            </p>

            {note.tags.length > 0 && (
              <p className="text-xs italic text-gray-700 mt-0.5">
                🏷 {note.tags.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList;
