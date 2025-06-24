import { useState } from "react";
import { encryptNote } from "../utils/crypto";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";

const Editor = ({ onSave, user }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    if (!title || !text || !password) {
      return toast.error("Fill all fields");
    }

    const cipher = encryptNote(text, password);
    const noteId = Date.now().toString();

    const data = JSON.stringify({
      title,
      cipher,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    });

    localStorage.setItem(`${user}-note-${noteId}`, data);

    onSave();
    setTitle("");
    setText("");
    setTags("");
    setPassword("");
    toast.success("Note saved!");
  };

  const strength = zxcvbn(password);

  return (
    <div className="p-4 space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full h-40"
        placeholder="Write your note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Tags (e.g., work, ideas)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Encryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {password && (
        <div className="text-sm text-gray-600">
          Password Strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][strength.score]}
        </div>
      )}
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
