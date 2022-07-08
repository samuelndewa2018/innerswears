import MailOutlineIcon from "@material-ui/icons/MailOutline";
import MetaData from "../more/MetaData";
import FaceIcon from "@material-ui/icons/Face";
import Header from "../header/Header";
import BottomTab from "../more/BottomTab";
import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadUser, updateProfile } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constans/userContans";
import { ToastContainer, toast } from "react-toastify";
import "./EditProfile.css";

const EditProfile = ({ history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(
    "https://res.cloudinary.com/bramuels/image/upload/v1656165811/avatar/Profile_sdltwi.png"
  );
  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };
  const deleteAvatar = (e) => {
    setAvatarPreview(
      "https://res.cloudinary.com/bramuels/image/upload/v1656165811/avatar/Profile_sdltwi.png"
    );
    setAvatar(
      "https://res.cloudinary.com/bramuels/image/upload/v1656165811/avatar/Profile_sdltwi.png"
    );
  };
  const updateProfileDataChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile updated successfully");
      dispatch(loadUser());

      history.push("/me");

      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, error, history, isUpdated, user]);

  return (
    <>
      <MetaData title="Update Profile" />
      <Header />
      <div className="updateProfileContainer">
        <div className="updateProfileBox">
          <h2 className="updateProfileHeading">Update Profile</h2>

          <form
            className="updateProfileForm"
            encType="multipart/form-data"
            onSubmit={updateProfileSubmit}
          >
            <div className="updateProfileName">
              <FaceIcon />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="updateProfileEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div id="updateProfileImage">
              <img src={avatarPreview} alt="Avatar Preview" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProfileDataChange}
              />
              <p
                classname="removeAvatar"
                onClick={deleteAvatar}
                style={{
                  cursor: "pointer",
                  margin: "2px 5px",
                  fontSize: "14px",
                }}
              >
                Remove
              </p>
            </div>

            <input
              type="submit"
              value={loading ? "Updating..." : "Update"}
              className="updateProfileBtn"
            />
          </form>
        </div>
      </div>
      <BottomTab />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default EditProfile;
