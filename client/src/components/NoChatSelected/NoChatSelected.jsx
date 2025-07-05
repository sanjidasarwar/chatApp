import { logo } from "../../assets";
import "./NoChatSelected.css";

function NoChatSelected() {
  return (
    <div className="chat-box no-chat-selected">
      <img className="logo" src={logo} alt="" />
      <p>Pick a person from left menu,</p>
      <p>and start your conversation.</p>
    </div>
  );
}

export default NoChatSelected;
