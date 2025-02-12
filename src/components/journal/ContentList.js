import React from "react";

function ContentList({ contents, handleEdit, handleDelete }) {
  return (
    <ul>
      {contents.map((content) => (
        <li key={content.id}>
          <h3>{content.title}</h3>
          <p>{content.content_field}</p>
          <small>{content.mood}</small>
          <button onClick={() => handleEdit(content)}>Edit</button>
          <button onClick={() => handleDelete(content.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default ContentList;
