import React from "react";
import "./RightSidebar.css";
import { profile_img } from "../../assets";

const RightSidebar = () => {
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={profile_img} alt="" />
        <h3>
          GreatStack <img src="" alt="" className="dot" />
        </h3>
        <p>Hey, There i am using chat app</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={profile_img} alt="" />
          <img src={profile_img} alt="" />
          <img src={profile_img} alt="" />
          <img src={profile_img} alt="" />
          <img src={profile_img} alt="" />
        </div>
      </div>
      {/* <button>Logout</button> */}
    </div>
  );
};

export default RightSidebar;
