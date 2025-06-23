import { useState } from "react";
import { encryptNote } from "../utils/crypto";
import { toast } from "react-toastify";

const Editor = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    if (!title || !text || !password) {
      return toast.error("Please fill in all fields");
    }

    const cipher = encryptNote(text, password);
    const noteId = Date.now().toString();
    const data = JSON.stringify({ title, cipher });

    localStorage.setItem(`note-${noteId}`, data);

    onSave(); // to refresh list
    setTitle("");
    setText("");
    setPassword("");
    toast.success("Note saved securely!");
  };

  return (
    <div className="p-4 space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full h-48 p-2 border"
        value={text}
        placeholder="Write your secure note here..."
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Encryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Save
      </button>
    </div>
  );
};

export default Editor;
