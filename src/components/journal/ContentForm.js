import React from "react";

function ContentForm({
  title,
  content_field,
  mood,
  setTitle,
  setContentField,
  setMood,
  handleSubmit,
  editing,
  resetForm,
}) {
  return (
    <div>
      <h2>{editing ? "Edit Entry" : "Add New Entry"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content_field}
          onChange={(e) => setContentField(e.target.value)}
          placeholder="Write your journal..."
          required
        />
        <select value={mood} onChange={(e) => setMood(e.target.value)} required>
          <option value="">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="neutral">Neutral</option>
          <option value="excited">Excited</option>
          <option value="angry">Angry</option>
        </select>
        <button type="submit">
          {editing ? "Update Entry" : "Submit Entry"}
        </button>
        {editing && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default ContentForm;
