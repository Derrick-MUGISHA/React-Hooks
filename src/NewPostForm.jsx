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
      <label className="field-label" htmlFor="title">Post title</label>
      <input
        id="title"
        placeholder="What would you like to share?"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "post-error" : undefined}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="publish-button" type="submit" disabled={saving}>
        {saving ? "Publishing…" : "Publish post"}<span aria-hidden="true">↗</span>
      </button>
      <p className="form-note">A space for a small thought or a big idea.<br />Demo posts are simulated and won’t be stored.</p>
      {error && <p className="feedback error" id="post-error" role="alert">{error}</p>}
      {createdPost && <p className="feedback success" role="status">Post created: {createdPost.title}</p>}
    </form>
  );
}
