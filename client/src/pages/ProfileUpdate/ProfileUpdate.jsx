import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { avator_icon, profile_icon } from "../../assets";
// import upload from "../../lib/upload";
import "./ProfileUpdate.css";

function ProfileUpdate() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!previewImage && !image) {
        toast.error("Upload Profile Picture");
      }
      if (image) {
        const imgUrl = await upload(image);
        console.log(imgUrl);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setUid(user.uid);
  //       if (docSnap.exists()) {
  //         const userData = docSnap.data();
  //         setName(userData.name || "");
  //         setBio(userData.bio || "");
  //         setPreviewImage(userData.avator || "");
  //       } else {
  //         navigate("/");
  //       }
  //     }
  //   });
  // }, []);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              id="avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : avator_icon}
              alt=""
            />
            upload profile image
          </label>
          <input
            placeholder="Your name"
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Write profile bio"
            required
            defaultValue={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : profile_icon}
          alt=""
        />
      </div>
    </div>
  );
}

export default ProfileUpdate;
