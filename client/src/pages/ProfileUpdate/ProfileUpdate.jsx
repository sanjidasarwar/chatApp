import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { avator_icon } from "../../assets";
// import upload from "../../lib/upload";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./ProfileUpdate.css";

function ProfileUpdate() {
  const [data, setData] = useState({
    name: "",
    image: "",
    previousPassword: "",
    password: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      const previewImg = URL.createObjectURL(files[0]);
      setPreviewImage(previewImg);
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!previewImage && !data.image) {
        toast.error("Upload Profile Picture");
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("previousPassword", data.previousPassword);
      formData.append("password", data.password);
      formData.append("image", data.image);

      updateUser(formData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    return () => {
      // cleanup previewImage url on unmount
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile details</h3>
          <label htmlFor="avatar">
            <input
              name="image"
              onChange={(e) => handleChange(e)}
              id="avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img src={previewImage || avator_icon} alt="" />
            upload profile image
          </label>
          <input
            placeholder="Your name"
            type="text"
            name="name"
            value={data.name}
            onChange={(e) => handleChange(e)}
          />
          <input
            placeholder="Previous Password"
            type="password"
            name="previousPassword"
            value={data.previousPassword}
            onChange={(e) => handleChange(e)}
          />
          <input
            placeholder="New Password"
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => handleChange(e)}
          />

          <button type="submit">Save</button>
        </form>
        <img className="profile-pic" src={previewImage || avator_icon} alt="" />
      </div>
    </div>
  );
}

export default ProfileUpdate;
