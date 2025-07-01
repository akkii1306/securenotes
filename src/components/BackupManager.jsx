import { useRef } from "react";
import { toast } from "react-toastify";

const BackupManager = ({ user, onRefresh }) => {
  const fileInputRef = useRef();

  const handleExport = () => {
    const notes = Object.entries(localStorage)
      .filter(([key]) => key.startsWith(`${user}-note-`))
      .map(([key, value]) => [key, value]);

    const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${user}_securenotes_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        let count = 0;

        imported.forEach(([key, value]) => {
          if (key.startsWith(`${user}-note-`) && !localStorage.getItem(key)) {
            localStorage.setItem(key, value);
            count++;
          }
        });

        toast.success(`✅ Imported ${count} notes`);
        onRefresh();
      } catch {
        toast.error("❌ Invalid or corrupted backup file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
      <button
        onClick={handleExport}
        className="button-29 w-full sm:w-auto text-center"
      >
        📤 Export Notes
      </button>

      <label className="button-29 w-full sm:w-auto text-center cursor-pointer">
        📥 Import Notes
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default BackupManager;
