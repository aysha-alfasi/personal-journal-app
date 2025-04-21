import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./ProfilePage.css";
import MoodChart from "../mood-chart/MoodChart";

function ProfilePage() {
  return (
    <>
      <div className="home-btns-wr">
        <Link to="/content-form">
          <Button className="add-btn">Add new journaling</Button>
        </Link>
        <Link to="/content-list">
          <Button className="list-btn">Show my journalings</Button>
        </Link>
      </div>
      <div className="chart-section">
        <h3 className="chart-text">Explore your daily feelings here.✨</h3>
        <MoodChart isDemo={false} />
      </div>
    </>
  );
}

export default ProfilePage;
