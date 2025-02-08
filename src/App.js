import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [contents, setContents] = useState([]);

  return (
    <div>
    <h1>Journal Contents</h1>
    <ul>
        {contents.map(content => (
            <li key={content.id}>
                <h2>{content.title}</h2>
                <p>{content.content_field}</p>
                <small>{content.mood}</small>
            </li>
        ))}
    </ul>
</div>
  );
}

export default App;