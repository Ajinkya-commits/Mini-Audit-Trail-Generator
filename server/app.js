import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
console.log(process.env.CLIENT_URL);

let versions = []; //in memory array

// diff functoin
function getWordDiff(oldText, newText) {
  const oldWords = oldText.trim().split(/\s+/).filter(Boolean);
  const newWords = newText.trim().split(/\s+/).filter(Boolean);

  const added = newWords.filter((word) => !oldWords.includes(word));
  const removed = oldWords.filter((word) => !newWords.includes(word));

  return { added, removed };
}

//post endpoint to save version
app.post("/save-version", (req, res) => {
  const { previousText, newText } = req.body;
  const prevText = previousText || "";
  const newTextContent = newText || "";
  const { added, removed } = getWordDiff(prevText, newTextContent);

  const versionEntry = {
    id: uuidv4(),
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    addedWords: added,
    removedWords: removed,
    oldLength: prevText.length,
    newLength: newText.length,
    fullText: newText,
  };
  versions.push(versionEntry);

  res.json(versionEntry);
});

app.get("/versions", (req, res) => {
  res.json(versions);
});

app.delete("/clear-versions", (req, res) => {
  versions = [];
  res.json({ message: "version cleared" });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
