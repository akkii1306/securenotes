import { useState } from "react";
import { decryptNote } from "../utils/crypto";
import ReactMarkdown from "react-markdown";

const NoteView = ({ cipher }) => {
  const [password, setPassword] = useState("");
  const [decrypted, setDecrypted] = useState("");

const handleDecrypt = () => {
  try {
    const plain = decryptNote(cipher, password);
    console.log("Decrypted result:", plain);  // 👈 Add this
    if (!plain) {
      setDecrypted("Incorrect password or corrupted data");
    } else {
      setDecrypted(plain);
    }
  } catch (err) {
    console.error("Decryption error:", err);
    setDecrypted("Error decrypting note");
  }
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
      <button
        onClick={handleDecrypt}
        className="bg-green-600 text-white px-4 py-2"
      >
        Decrypt
      </button>
      {decrypted && (
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => (
              <p className="prose">{props.children}</p>
            ),
            h1: ({ node, ...props }) => (
              <h1 className="prose text-2xl font-bold">{props.children}</h1>
            ),
            li: ({ node, ...props }) => (
              <li className="list-disc list-inside">{props.children}</li>
            ),
          }}
        >
          {decrypted}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default NoteView;
