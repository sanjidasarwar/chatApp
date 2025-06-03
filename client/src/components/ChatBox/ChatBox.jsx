import React from "react";
import "./ChatBox.css";
import { profile_img, img_attachment, arrow, help } from "../../assets";

function ChatBox() {
  return (
    <div className="chat-box ">
      <div className="chat-user">
        <img src={profile_img} alt="" />
        <p>GreatStack</p>
        <img className="arrow" src="" alt="" />
        <img className="help" src={help} alt="" />
      </div>
      <div className="chat-msg">
        <div className="s-msg">
          <p className="msg">Lorem ipsum dolor sit amet...</p>
          <div>
            <img src={profile_img} alt="" />
            <p>2.30 PM</p>
          </div>
        </div>
        <div className="r-msg">
          <p className="msg">Lorem ipsum dolor sit amet...</p>
          <div>
            <img src={profile_img} alt="" />
            <p>2.30 PM</p>
          </div>
        </div>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Send a message" />
        <label htmlFor="image">
          <img src={img_attachment} alt="" />
        </label>
        <img src={arrow} alt="" />
      </div>
    </div>
  );
}

export default ChatBox;
