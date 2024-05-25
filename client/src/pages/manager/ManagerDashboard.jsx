import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateStart,
  signoutStart,
  signoutSuccess,
  signoutFailure,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./ManagerUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";

const ManagerDashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    photo: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        photo: currentUser.photo,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = async (photo) => {
    try {
      dispatch(updateStart());
      const storage = getStorage(app);
      const photoname = new Date().getTime() + photo.name.replace(/\s/g, "");
      const storageRef = ref(storage, `profile-photos/${photoname}`);
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPhotoPercentage(progress);
        },
        (error) => {
          console.log(error);
          dispatch(updateFailure("Upload failed"));
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const res = await fetch(
              `${API_BASE_URL}/api/user/update-profile-photo/${currentUser._id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ photo: downloadUrl }),
              }
            );
            const data = await res.json();
            if (data?.success) {
              alert(data?.message);
              setFormData({ ...formData, photo: downloadUrl });
              dispatch(updateSuccess(data?.user));
              setProfilePhoto(null);
            } else {
              dispatch(updateFailure(data?.message));
              alert(data?.message);
            }
          } catch (error) {
            console.log(error);
            dispatch(updateFailure("Failed to update profile photo"));
          }
        }
      );
    } catch (error) {
      console.log(error);
      dispatch(updateFailure("An error occurred during the upload process"));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`);
      const data = await res.json();
      if (!data?.success) {
        dispatch(signoutFailure(data?.message));
        return;
      }
      dispatch(signoutSuccess());
      navigate("/login");
      alert(data?.message);
    } catch (error) {
      console.log(error);
      dispatch(signoutFailure("Failed to log out"));
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure? The account will be permanently deleted!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(
          `${API_BASE_URL}/api/user/delete/${currentUser._id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        if (!data?.success) {
          dispatch(deleteUserFailure(data?.message));
          alert("Something went wrong!");
          return;
        }
        dispatch(deleteUserSuccess());
        alert(data?.message);
      } catch (error) {
        console.log(error);
        dispatch(deleteUserFailure("Failed to delete account"));
      }
    }
  };

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2">
      {currentUser ? (
        <>
          <div className="w-[35%] p-3 max-sm:w-full">
            <div className="flex flex-col items-center gap-4 p-3">
              <div className="w-full flex flex-col items-center relative">
                <img
                  src={
                    (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                    formData.photo
                  }
                  alt="Profile photo"
                  className="w-64 min-h-52 max-h-64 rounded-lg"
                  onClick={() => fileRef.current.click()}
                  onMouseOver={() => {
                    document
                      .getElementById("photoLabel")
                      .classList.add("block");
                  }}
                  onMouseOut={() => {
                    document
                      .getElementById("photoLabel")
                      .classList.remove("block");
                  }}
                />
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                />
                <label
                  htmlFor="photo"
                  id="photoLabel"
                  className="w-64 bg-slate-300 absolute bottom-0 p-2 text-center text-lg text-white font-semibold rounded-b-lg"
                  hidden
                >
                  Choose Photo
                </label>
              </div>
              {profilePhoto && (
                <div className="flex w-full justify-between gap-1">
                  <button
                    onClick={() => handleProfilePhoto(profilePhoto)}
                    className="bg-green-700 p-2 text-white mt-3 flex-1 hover:opacity-90"
                  >
                    {loading ? `Uploading...(${photoPercentage}%)` : "Upload"}
                  </button>
                </div>
              )}
              <p
                style={{
                  width: "100%",
                  borderBottom: "1px solid black",
                  lineHeight: "0.1em",
                  margin: "10px",
                }}
              >
                <span className="font-semibold" style={{ background: "#fff" }}>
                  Details
                </span>
              </p>
              <div className="w-full flex justify-between px-1">
                <button
                  onClick={handleLogout}
                  className="text-red-600 text-lg font-semibold self-start border border-red-600 p-1 rounded-lg hover:bg-red-600 hover:text-white"
                >
                  Log-out
                </button>
                <button
                  onClick={() => setActivePanelId(8)}
                  className="text-white text-lg self-end bg-gray-500 p-1 rounded-lg hover:bg-gray-700"
                >
                  Edit Profile
                </button>
              </div>
              <div className="w-full shadow-2xl rounded-lg p-3 break-all">
                <p className="text-3xl font-semibold m-1">
                  Hi {currentUser.username}!
                </p>
                <p className="text-lg font-semibold">
                  Email: {currentUser.email}
                </p>
                <p className="text-lg font-semibold">
                  Phone: {currentUser.phone}
                </p>
                <p className="text-lg font-semibold">
                  Address: {currentUser.address}
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:underline"
              >
                Delete account
              </button>
            </div>
          </div>
          <div className="w-[65%] max-sm:w-full">
            <div className="main-div">
              <nav className="w-full border-blue-500 border-b-4 overflow-x-auto navbar">
                <div className="w-full flex gap-2">
                  <button
                    className={
                      activePanelId === 1
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    onClick={() => setActivePanelId(1)}
                  >
                    Bookings
                  </button>
                  <button
                    className={
                      activePanelId === 2
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    onClick={() => setActivePanelId(2)}
                  >
                    Add Packages
                  </button>
                  <button
                    className={
                      activePanelId === 3
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    onClick={() => setActivePanelId(3)}
                  >
                    All Packages
                  </button>
                  <button
                    className={
                      activePanelId === 4
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    onClick={() => setActivePanelId(4)}
                  >
                    Users
                  </button>
                  <button
                    className={
                      activePanelId === 5
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    onClick={() => setActivePanelId(5)}
                  >
                    Payments
                  </button>
                  <button
                    className={
                      activePanelId === 6
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    onClick={() => setActivePanelId(6)}
                  >
                    Ratings/Reviews
                  </button>
                  <button
                    className={
                      activePanelId === 7
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    onClick={() => setActivePanelId(7)}
                  >
                    History
                  </button>
                </div>
              </nav>
              <div className="content-div flex flex-wrap">
                {activePanelId === 1 ? (
                  <AllBookings />
                ) : activePanelId === 2 ? (
                  <AddPackages />
                ) : activePanelId === 3 ? (
                  <AllPackages />
                ) : activePanelId === 4 ? (
                  <AllUsers />
                ) : activePanelId === 5 ? (
                  <Payments />
                ) : activePanelId === 6 ? (
                  <RatingsReviews />
                ) : activePanelId === 7 ? (
                  <History />
                ) : activePanelId === 8 ? (
                  <AdminUpdateProfile />
                ) : (
                  <div>Page Not Found!</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <p className="text-red-700">Login First</p>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
