import { useState } from "react";

export default function NewPostForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdPost, setCreatedPost] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    if (!title.trim()) return setError("Please enter a title.");
    setSaving(true);
    setError("");
    setCreatedPost(null);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: "…", userId: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const post = await res.json();
      onCreated?.(post);
      setCreatedPost(post);
      setTitle("");
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Publish"}
      </button>
      {error && <p role="alert">{error}</p>}
      {createdPost && <p role="status">Post created: {createdPost.title}</p>}
    </form>
  );
}
