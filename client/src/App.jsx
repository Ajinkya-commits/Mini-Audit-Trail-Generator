import { useState, useEffect } from "react";
import { getVersion, saveVersion } from "./api";
import axios from "axios";

const App = () => {
  const [text, setText] = useState("");
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    async function fetchVersions() {
      const data = await getVersion();
      setVersions(data);

      if (data.length > 0) {
        setText(data[data.length - 1].fullText);
      }
    }

    fetchVersions();
  }, []);

  const handleSave = async () => {
    const previousText = versions.length
      ? versions[versions.length - 1].fullText
      : "";
    const newVersion = await saveVersion(previousText, text);
    setVersions((prev) => [...prev, newVersion]);
  };

  const handleClear = async () => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/clear-versions`);
    setVersions([]);
    setText("");
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mini Audit Trail Generator</h1>

      <textarea
        className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full h-40 p-3.5 shadow-xs placeholder:text-body"
        placeholder="Content Editor"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
      >
        Save Version
      </button>

      <button
        onClick={handleClear}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
      >
        Clear All Versions
      </button>

      <h2 className="text-xl font-semibold mt-6 mb-2">Version History</h2>
      <div>
        {versions.map((v) => (
          <div key={v.id} className="border p-3 rounded bg-gray-50 mt-2">
            <div>
              <strong>ID:</strong> {v.id}
            </div>
            <div>
              <strong>Time:</strong> {v.timestamp}
            </div>
            <div>
              <strong>Added:</strong> {v.addedWords.join(", ") || "None"}
            </div>
            <div>
              <strong>Removed:</strong> {v.removedWords.join(", ") || "None"}
            </div>
            <div>
              <strong>Old Length:</strong> {v.oldLength}
            </div>
            <div>
              <strong>New Length:</strong> {v.newLength}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
