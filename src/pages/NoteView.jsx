import { useState } from "react";
import { decryptNote } from "../utils/crypto";
import ReactMarkdown from "react-markdown";

const NoteView = ({ cipher, onEdit }) => {
  const [password, setPassword] = useState("");
  const [decrypted, setDecrypted] = useState(null);
  const [meta, setMeta] = useState({ createdAt: null, updatedAt: null });
  const [noteInfo, setNoteInfo] = useState(null); // { id, title, tags }

  const handleDecrypt = () => {
    const allEntries = Object.entries(localStorage);
    const found = allEntries.find(([, value]) => {
      try {
        const parsed = JSON.parse(value);
        return parsed.cipher === cipher;
      } catch {
        return false;
      }
    });

    if (!found) {
      setDecrypted("⚠ Note not found.");
      return;
    }

    const [id, storedValue] = found;
    const parsed = JSON.parse(storedValue);
    const plain = decryptNote(parsed.cipher, password);

    if (!plain) {
      setDecrypted("❌ Incorrect password or corrupted data");
    } else {
      setDecrypted(plain);
      setNoteInfo({ id, title: parsed.title, tags: parsed.tags || [] });
      setMeta({
        createdAt: parsed.createdAt,
        updatedAt: parsed.updatedAt || parsed.createdAt,
      });
    }
  };

  return (
    <div className="p-4 space-y-4 mt-6 bg-white/10 backdrop-blur-md rounded-xl shadow-md text-white w-full max-w-3xl mx-auto">
      <input
        className="bg-white/10 border border-white/20 p-2 rounded w-full text-white placeholder-white/60"
        type="password"
        placeholder="🔑 Decryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleDecrypt}
        className="w-full sm:w-auto bg-green-400 hover:bg-green-500 text-black px-4 py-2 rounded font-semibold transition"
      >
        🔓 Decrypt
      </button>

      {decrypted && (
        <div className="mt-4 space-y-3 overflow-x-auto">
          <div className="prose prose-invert max-w-none text-white break-words">
            <ReactMarkdown>{decrypted}</ReactMarkdown>
          </div>

          {noteInfo && (
            <button
              onClick={() =>
                onEdit({
                  id: noteInfo.id,
                  title: noteInfo.title,
                  tags: noteInfo.tags,
                  plainText: decrypted,
                })
              }
              className="text-blue-300 hover:underline text-sm"
            >
              ✏️ Edit Note
            </button>
          )}

          {meta.createdAt && (
            <div className="text-xs text-white/70">
              <p>🕓 Created: {new Date(meta.createdAt).toLocaleString()}</p>
              <p>🔄 Updated: {new Date(meta.updatedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteView;
