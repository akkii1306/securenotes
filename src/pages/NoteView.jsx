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
    <div className="p-4 space-y-4 bg-white shadow rounded">
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="🔑 Decryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleDecrypt}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Decrypt
      </button>

      {decrypted && (
        <div className="mt-4 space-y-2">
          <ReactMarkdown>{decrypted}</ReactMarkdown>

          {noteInfo && (
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() =>
                onEdit({
                  id: noteInfo.id,
                  title: noteInfo.title,
                  tags: noteInfo.tags,
                  plainText: decrypted,
                })
              }
            >
              ✏️ Edit Note
            </button>
          )}

          {meta.createdAt && (
            <div className="text-xs text-gray-500 mt-2">
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
