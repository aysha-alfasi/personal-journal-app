import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, List } from "antd";
import ContentForm from "./ContentForm";
import "./ContentList.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setEditing } from "../../redux/slices/contentSlice";

function ContentList({ contents, handleDelete, handleSubmit }) {
  const [editingContent, setEditingContent] = useState(null);
  const dispatch = useDispatch();

  const handleEdit = (content) => {
    dispatch(setEditing(content.id));
    setEditingContent(content);
  };

  return (
    /*  <ul>
      {contents.map((content) => (
        <li key={content.id}>
          <h3>{content.title}</h3>
          <p>{content.content_field}</p>
          <small>{content.mood}</small>
          <Button onClick={() => handleEdit(content)}>Edit</Button>
          <Button onClick={() => handleDelete(content.id)}>Delete</Button>
        </li>
      ))}
    </ul> */
    <>
      <div className="content-list">
        {!editingContent ? (
          <List
            dataSource={contents}
            renderItem={(content) => (
              <List.Item
                className="try1"
                key={content.id}
                actions={[
                  <Button
                    className="edit-btn"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(content)}
                    type="primary"
                    size="small"
                  >
                    Edit
                  </Button>,
                  <Button
                    className="delete-btn"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(content.id)}
                    type="danger"
                    size="small"
                  >
                    Delete
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div
                      className="custom-title"
                      style={{ whiteSpace: "normal" }}
                    >
                      <Link to={`/content-list/${content.id}`}>
                        {content.title}
                      </Link>
                    </div>
                  }
                  description={
                    <div style={{ whiteSpace: "normal" }}>
                      <p>{content.content_field}</p>
                      <small>Mood: {content.mood}</small>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : null}
      </div>

      {editingContent && (
        <ContentForm
          title={editingContent.title}
          content_field={editingContent.content_field}
          mood={editingContent.mood}
          editing={true}
          setTitle={(value) =>
            setEditingContent({ ...editingContent, title: value })
          }
          setContent_field={(value) =>
            setEditingContent({ ...editingContent, content_field: value })
          }
          setMood={(value) =>
            setEditingContent({ ...editingContent, mood: value })
          }
          resetForm={() => setEditingContent(null)}
          handleEdit={handleEdit}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default ContentList;
