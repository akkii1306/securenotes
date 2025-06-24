import { useState } from "react";
import { encryptNote } from "../utils/crypto";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";

const Editor = ({ onSave, user }) => {
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

    localStorage.setItem(`${user}-note-${noteId}`, data);

    onSave(); // Notify parent to refresh notes
    setTitle("");
    setText("");
    setPassword("");
    toast.success("Note saved securely!");
  };

  const strength = zxcvbn(password);
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];

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
        placeholder="Write your secure note here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Encryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {password && (
        <div className="space-y-1">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${strengthColor[strength.score]}`}
              style={{ width: `${(strength.score + 1) * 20}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">Strength: {strengthText[strength.score]}</p>
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
