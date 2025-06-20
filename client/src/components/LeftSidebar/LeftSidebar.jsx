import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logo, profile_img, search, three_dot } from "../../assets";
import { AuthContext } from "../../context/AuthContext";
import AddConverstionModal from "./AddConverstionModal";
import "./LeftSidebar.css";

function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="ls hidden">
        <div className="ls-top">
          <div className="ls-nav">
            <img className="logo" src={logo} alt="" />
            <div className="menu">
              <img src={three_dot} alt="" />
              <div className="sub-menu">
                <p onClick={() => navigate("/profile-update")}>Edit Profile</p>
                <hr />
                <p onClick={() => logout()}>Logout</p>
              </div>
            </div>
          </div>
          <div className="ls-search">
            <img src={search} alt="" />
            <input type="text" placeholder="Search.." />
          </div>
          <div>
            <button onClick={() => setIsOpen(true)}>
              Add New Conversation
            </button>
          </div>
        </div>
        <div className="ls-list">
          {Array(12)
            .fill("")
            .map((item, index) => (
              <div key={index} className="friends ">
                <img src={profile_img} alt="" />
                <div>
                  <p>GreatStack</p>
                  <span></span>
                </div>
              </div>
            ))}
        </div>
      </div>
      {isOpen && <AddConverstionModal />}
    </>
  );
}

export default LeftSidebar;
