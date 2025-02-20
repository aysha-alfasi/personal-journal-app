import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./ProfilePage.css";

function ProfilePage() {
  return (
    <div className="home-btns-wr">
      <Link to="/content-form">
        <Button className="add-btn">Add new journaling</Button>
      </Link>
      <Link to="/content-list">
        <Button className="list-btn">Show my journalings</Button>
      </Link>
    </div>
  );
}

export default ProfilePage;
