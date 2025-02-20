import React from "react";
import { useParams } from "react-router-dom";

function ContentDetails({ contents }) {
  const { id } = useParams();

  if (!contents || contents.length === 0) {
    return <p>Your Journaling list is empty🤭</p>;
  }

  const content = contents.find((content) => content.id === parseInt(id));

  if (!content) {
    return <p>The post is not found.😓</p>;
  }

  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.content_field}</p>
      <p>{content.mood}</p>
    </div>
  );
}

export default ContentDetails;
