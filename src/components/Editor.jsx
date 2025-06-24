import { useState, useEffect } from "react";
import { encryptNote } from "../utils/crypto";
import { toast } from "react-toastify";

const Editor = ({ user, onSave, editNote, isEditing, onEditDone }) => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [color, setColor] = useState("#F3F4F6"); // default light gray

  const generateStrongPassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!%&*?";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  useEffect(() => {
    if (password) {
      setStrength(checkStrength(password));
    } else {
      setStrength("");
    }
  }, [password]);

  useEffect(() => {
    if (isEditing && editNote) {
      setText(editNote.plainText);
      setTitle(editNote.title);
      setTags(editNote.tags.join(", "));
      setPinned(editNote.pinned || false);
      setColor(editNote.color || "#F3F4F6");
    }
  }, [isEditing, editNote]);

  const checkStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (!/[A-Z]/.test(password)) return "Medium";
    if (!/[0-9]/.test(password)) return "Medium";
    if (!/[!@#$%^&*]/.test(password)) return "Medium";
    return "Strong";
  };

  const handleSave = () => {
    if (!text || !password || !title) {
      return toast.error("Please fill all fields");
    }

    const cipher = encryptNote(text, password);
    const timestamp = new Date().toISOString();
    const noteId =
      isEditing && editNote.id ? editNote.id : `${user}-note-${Date.now()}`;

    const noteData = {
      title,
      tags: tags.split(",").map((tag) => tag.trim()),
      cipher,
      pinned,
      color,
      createdAt:
        isEditing && editNote.createdAt ? editNote.createdAt : timestamp,
      updatedAt: timestamp,
    };

    localStorage.setItem(noteId, JSON.stringify(noteData));
    setText("");
    setPassword("");
    setTitle("");
    setTags("");
    setStrength("");
    setPinned(false);
    setColor("#F3F4F6");
    toast.success(isEditing ? "Note updated!" : "Note saved!");
    onSave();
    if (isEditing) onEditDone();
  };

  return (
    <div className="p-4 space-y-4 border rounded mb-4 bg-white shadow">
      <input
        className="w-full p-2 border rounded"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full h-36 p-2 border rounded"
        value={text}
        placeholder="Write your secure note here..."
        onChange={(e) => setText(e.target.value)}
      />

      {/* Password Input */}
      <div className="space-y-1">
        <div className="relative">
          <input
            className="border p-2 w-full rounded pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Encryption Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button
          onClick={() => setPassword(generateStrongPassword())}
          className="text-sm text-blue-600 hover:underline"
        >
          🔁 Generate Strong Password
        </button>

        {strength && (
          <div className="flex items-center gap-4">
            <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  strength === "Weak"
                    ? "bg-red-500 w-1/3"
                    : strength === "Medium"
                    ? "bg-yellow-500 w-2/3"
                    : "bg-green-500 w-full"
                }`}
              ></div>
            </div>
            <span
              className={`text-sm font-semibold ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-600"
              }`}
            >
              {strength}
            </span>
          </div>
        )}
      </div>

      <input
        className="border p-2 w-full rounded"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
        />
        <label>📌 Pin this note</label>
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-2 text-sm">
        <label>🎨 Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 p-0 border rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Save Note
      </button>
    </div>
  );
};

export default Editor;
