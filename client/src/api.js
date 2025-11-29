import axios from "axios";

export async function getVersion() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/versions`);
    return res.data;
  } catch (err) {
    console.error("Error fetching versions:", err);
    return [];
  }
}

export async function saveVersion(previousText, newText) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/save-version`,
      {
        previousText,
        newText,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error saving version:", err);
    return null;
  }
}
