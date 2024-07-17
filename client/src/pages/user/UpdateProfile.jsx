import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../../redux/user/userSlice";
import { setCredentials } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate if you are using react-router-dom

const UpdateProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate for redirection
  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    userProfileImg: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        userProfileImg: currentUser.userProfileImg,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.id]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (
      currentUser.username === formData.username &&
      currentUser.email === formData.email &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      alert("Change at least 1 field to update details");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(
        `${API_BASE_URL}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!data.success && res.status !== 201 && res.status !== 200) {
        dispatch(updateFailure(data?.message));
        alert("Session Ended! Please login again");
        navigate("/login");
        return;
      }
      if (data.success && res.status === 201) {
        alert(data?.message);
        dispatch(updateSuccess(data?.user));
        return;
      }
      alert(data?.message);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (
      updatePassword.oldpassword === "" ||
      updatePassword.newpassword === ""
    ) {
      alert("Enter a valid password");
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      alert("New password can't be the same!");
      return;
    }
    try {
      dispatch(setCredentials());
      const res = await fetch(
        `${API_BASE_URL}/api/user/update-password/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePassword),
        }
      );
      const data = await res.json();
      if (!data.success && res.status !== 201 && res.status !== 200) {
        dispatch(setCredentials(data?.message));
        alert("Session Ended! Please login again");
        navigate("/login");
        return;
      }
      dispatch(setCredentials());
      alert(data?.message);
      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`updateProfile w-full p-3 m-1 transition-all duration-300 flex justify-center`}
    >
      {updateProfileDetailsPanel === true ? (
        <div className="flex flex-col border self-center border-black rounded-lg p-2 w-72 h-fit gap-2 sm:w-[320px]">
          <h1 className="text-2xl text-center font-semibold">Update Profile</h1>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="p-1 rounded border border-black"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="p-1 rounded border border-black"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address" className="font-semibold">
              Address:
            </label>
            <textarea
              maxLength={200}
              type="text"
              id="address"
              className="p-1 rounded border border-black resize-none"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="font-semibold">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              className="p-1 rounded border border-black"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button
            disabled={loading}
            onClick={updateUserDetails}
            className="p-2 text-white bg-slate-700 rounded hover:opacity-95"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <button
            disabled={loading}
            type="button"
            onClick={() => setUpdateProfileDetailsPanel(false)}
            className="p-2 text-white bg-red-700 rounded hover:opacity-95"
          >
            {loading ? "Loading..." : "Change Password"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col border border-black rounded-lg p-2 w-72 h-fit gap-2 sm:w-[320px]">
          <h1 className="text-2xl text-center font-semibold">
            Change Password
          </h1>
          <div className="flex flex-col">
            <label htmlFor="oldpassword" className="font-semibold">
              Enter old password:
            </label>
            <input
              type="password"
              id="oldpassword"
              className="p-1 rounded border border-black"
              value={updatePassword.oldpassword}
              onChange={handlePass}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="newpassword" className="font-semibold">
              Enter new password:
            </label>
            <input
              type="password"
              id="newpassword"
              className="p-1 rounded border border-black"
              value={updatePassword.newpassword}
              onChange={handlePass}
            />
          </div>
          <button
            disabled={loading}
            onClick={updateUserPassword}
            className="p-2 text-white bg-slate-700 rounded hover:opacity-95"
          >
            {loading ? "Loading..." : "Update Password"}
          </button>
          <button
            disabled={loading}
            onClick={() => {
              setUpdateProfileDetailsPanel(true);
              setUpdatePassword({
                oldpassword: "",
                newpassword: "",
              });
            }}
            type="button"
            className="p-2 text-white bg-red-700 rounded hover:opacity-95 w-24"
          >
            {loading ? "Loading..." : "Back"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
