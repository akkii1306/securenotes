import { useState } from "react";
import { decryptNote } from "../utils/crypto";
import ReactMarkdown from "react-markdown";

const NoteView = ({ cipher, onBack }) => {
  const [password, setPassword] = useState("");
  const [decrypted, setDecrypted] = useState("");

  const handleDecrypt = () => {
    const plain = decryptNote(cipher, password);
    setDecrypted(plain || "Incorrect password or corrupted data");
  };

  return (
    <div className="p-4 space-y-4">
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Decryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleDecrypt} className="bg-green-600 text-white px-4 py-2">
        Decrypt
      </button>
      {decrypted && (
        <div className="prose bg-gray-100 p-4 rounded">
          <ReactMarkdown>{decrypted}</ReactMarkdown>
        </div>
      )}
      <button onClick={onBack} className="text-sm text-purple-600 hover:underline">
        ← Back
      </button>
    </div>
  );
};
export default NoteView;
