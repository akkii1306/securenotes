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
  const [color, setColor] = useState("#FFE99A"); // default yellow

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
    if (password) setStrength(checkStrength(password));
    else setStrength("");
  }, [password]);

  useEffect(() => {
    if (isEditing && editNote) {
      setText(editNote.plainText);
      setTitle(editNote.title);
      setTags(editNote.tags.join(", "));
      setPinned(editNote.pinned || false);
      setColor(editNote.color || "#FFE99A");
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
    if (!text || !password || !title)
      return toast.error("Please fill all fields");

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
    toast.success(isEditing ? "Note updated!" : "Note saved!");

    // Reset
    setText("");
    setPassword("");
    setTitle("");
    setTags("");
    setStrength("");
    setPinned(false);
    setColor("#FFE99A");
    onSave();
    if (isEditing) onEditDone();
  };

  return (
    <div className="p-4 space-y-4 border rounded-xl shadow-md bg-white/10 backdrop-blur-md text-white">
      <input
        className="w-full p-2 bg-white/10 rounded text-white border border-white/20"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full h-36 p-2 bg-white/10 rounded text-white border border-white/20"
        placeholder="Write your note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Password */}
      <div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 pr-10 bg-white/10 text-white rounded border border-white/20"
            placeholder="Encryption password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-2 right-3 text-white/70"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button
          onClick={() => setPassword(generateStrongPassword())}
          className="text-xs mt-1 text-blue-300 hover:underline"
        >
          🔁 Generate Strong Password
        </button>

        {strength && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-full h-2 bg-white/20 rounded overflow-hidden">
              <div
                className={`h-full ${
                  strength === "Weak"
                    ? "bg-red-400 w-1/3"
                    : strength === "Medium"
                    ? "bg-yellow-400 w-2/3"
                    : "bg-green-400 w-full"
                }`}
              ></div>
            </div>
            <span className="text-sm">{strength}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <input
        className="w-full p-2 bg-white/10 text-white rounded border border-white/20"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* Pin + Color */}
      <div className="flex items-center justify-between text-sm text-white/80">
        <label>
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="mr-1"
          />
          📌 Pin this note
        </label>

        <div className="flex items-center gap-2">
          <span>🎨</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded border"
          />
        </div>
      </div>

      <button
        onClick={handleSave} className="button-29"
      >
        💾 Save Note
      </button>
    </div>
  );
};

export default Editor;
