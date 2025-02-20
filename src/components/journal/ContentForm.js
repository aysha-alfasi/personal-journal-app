import React from "react";
import { Button, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./ContentForm.css";

const { TextArea } = Input;

function ContentForm({
  title,
  content_field,
  mood,
  setTitle,
  setContent_field,
  setMood,
  handleSubmit,
  resetForm,
  editing,
}) {
  const navigate = useNavigate();

  console.log("Redux Editing:", editing);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const updatedContent = {
      title,
      content_field,
      mood,
      id: editing,
    };

    console.log("Updated Content before submit:", updatedContent);

    await handleSubmit(updatedContent);

    if (editing) {
      message.success("Edited!");
      navigate("/content-list");
    } else {
      message.success("Submitted successfully!");
      navigate("/");
    }

    resetForm();
  };

  return (
    <div className="add-content-wr">
      <p className="sm">Happy Journaling</p>
      <form className="add-content-form" onSubmit={handleSubmitForm}>
        <Input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <TextArea
          className="content-input"
          value={content_field}
          onChange={(e) => setContent_field(e.target.value)}
          placeholder="Write your journal..."
          required
        />
        <p className="select-reminder">
          Please don't forget to select your mood 🫶
        </p>
        <div className="select-submit">
          <Select
            value={mood}
            onChange={(value) => setMood(value)}
            required
            className="custom-select"
          >
            <Select.Option value="" disabled>
              Select Mood
            </Select.Option>
            <Select.Option value="happy">Happy</Select.Option>
            <Select.Option value="sad">Sad</Select.Option>
            <Select.Option value="neutral">Neutral</Select.Option>
            <Select.Option value="excited">Excited</Select.Option>
            <Select.Option value="angry">Angry</Select.Option>
          </Select>

          <Button className="custom-button" htmlType="submit">
            {editing ? "Update" : "Submit✨"}
          </Button>
          {editing && (
            <Button
              className="custom-button"
              htmlType="button"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ContentForm;
