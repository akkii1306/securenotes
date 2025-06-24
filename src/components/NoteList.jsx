import { useEffect, useState } from "react";

const NoteList = ({ user, onOpen, refreshFlag }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const userNotes = Object.entries(localStorage)
      .filter(([key]) => key.startsWith(`${user}-note-`))
      .map(([id, data]) => {
        try {
          const parsed = JSON.parse(data);
          return {
            id,
            title: parsed.title || "Untitled",
            cipher: parsed.cipher,
            createdAt: parsed.createdAt,
            tags: parsed.tags || [],
            pinned: parsed.pinned || false,
            color: parsed.color || "#F3F4F6",
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

    setNotes(userNotes);
  }, [user, refreshFlag]);

  const handleDelete = (id) => {
    const confirm = window.confirm("Delete this note?");
    if (confirm) {
      localStorage.removeItem(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="font-bold text-lg">📋 Saved Notes</h2>
      {notes.length === 0 && <p>No notes saved yet.</p>}
      {notes.map((note) => (
        <div
          key={note.id}
          style={{ backgroundColor: note.color }}
          className="px-4 py-2 rounded shadow-sm space-y-1"
        >
          <div className="flex justify-between items-center">
            <button
              onClick={() => onOpen(note.cipher)}
              className="text-left font-medium w-full text-purple-700"
            >
              {note.pinned ? "📌 " : "📝 "}
              {note.title}
            </button>
            <button
              onClick={() => handleDelete(note.id)}
              className="text-red-600 text-sm hover:underline"
            >
              🗑 Delete
            </button>
          </div>
          <p className="text-xs text-gray-500">
            📅 Created: {new Date(note.createdAt).toLocaleString()}
          </p>
          {note.tags.length > 0 && (
            <p className="text-xs text-gray-600 italic">
              🏷 Tags: {note.tags.join(", ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoteList;
