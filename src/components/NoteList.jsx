import { useState, useEffect } from "react";

const NoteList = ({ user, onOpen, refreshFlag }) => {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const userNotes = Object.entries(localStorage)
      .filter(([key]) => key.startsWith(`${user}-note-`))
      .map(([key, value]) => {
        const parsed = JSON.parse(value);
        return {
          id: key,
          title: parsed.title || "Untitled",
          tags: parsed.tags || [],
          cipher: parsed.cipher,
        };
      });

    setNotes(userNotes);
  }, [user, refreshFlag]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this note?")) {
      localStorage.removeItem(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  const filteredNotes = notes.filter((note) => {
    const q = query.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-2 mt-4">
      <h2 className="text-lg font-semibold">🗂 Saved Notes</h2>

      <input
        type="text"
        placeholder="🔍 Search by title or tag..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {filteredNotes.length === 0 ? (
        <p className="text-gray-500">No matching notes found.</p>
      ) : (
        filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-100 px-4 py-2 rounded shadow-sm space-y-1"
          >
            <div className="flex justify-between items-center">
              <button
                onClick={() => onOpen(note.cipher)}
                className="text-left font-medium"
              >
                📝 {note.title}
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-600 text-sm hover:underline"
              >
                🗑 Delete
              </button>
            </div>
            {note.tags.length > 0 && (
              <p className="text-xs italic text-gray-600">
                Tags: {note.tags.join(", ")}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;
