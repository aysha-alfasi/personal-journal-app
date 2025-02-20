import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./UserProfile.css";
import sparkle from "../../img/sparkle.png";
import flower from "../../img/lap.png";
import home from "../../img/home.png";
import sunSet from "../../img/g5.png";
import star from "../../img/star.png";
import present from "../../img/present.png";

function UserProfile({ user, handleLogout }) {
  const navigate = useNavigate();

  const handleGoToJournals = () => {
    navigate("/content-list");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="user-profile">
        {user ? (
          <div>
            <div className="nav-btns">
              {/* <p id="welcoming-the-user">Welcome, {user.username}</p> */}
              <Button className="nav-button-3" onClick={handleGoToHome}>
                Home
              </Button>
              <Button className="nav-button-1" onClick={handleGoToJournals}>
                My Journals
              </Button>
              <Button className="nav-button-2" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="intro">
        <h2>
          Jourlaning improves our lives!
          <br /> <span>Let's write about Joy and challenges!</span>
        </h2>
        <div className="emoji-container">
          <span className="emoji">
            <img src={sparkle} alt="small sparkle" />
          </span>
          <span className="emoji">
            <img src={star} alt="small star" />
          </span>
          <span className="emoji">
            <img src={home} alt="small house" />
          </span>
          <span className="emoji">
            <img src={sunSet} alt="small sunset" />
          </span>
          <span className="emoji">
            <img src={present} alt="small present" />
          </span>
          <span className="emoji">
            <img src={flower} alt="small flower" />
          </span>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
