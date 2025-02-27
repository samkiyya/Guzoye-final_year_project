import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import MyBookings from "../pages/user/MyBookings";
import UpdateProfile from "../pages/user/UpdateProfile";
import MyHistory from "../pages/user/MyHistory";
import "react-circular-progressbar/dist/styles.css";

export default function Profile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const { currentUser, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filePickerRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccessMessage, setUpdateUserSuccessMessage] =
    useState(null);
  const [updateUserErrorMessage, setUpdateUserErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    phone: "",
    userProfileImg: "",
    skill: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        username: currentUser.username || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        phone: currentUser.phone || "",
        userProfileImg: currentUser.userProfileImg || "",
        skill: currentUser.skill || "",
      });
      setImageFileUrl(currentUser.userProfileImg || "");
    }
  }, [currentUser]);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${imageFile.name.replace(
      /\s/g,
      ""
    )}`;
    const storageRef = ref(storage, `profile-photos/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // Ensure the image URL is updated
          setFormData((prevFormData) => ({
            ...prevFormData,
            userProfileImg: downloadURL,
          }));
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserErrorMessage(null);
    setUpdateUserSuccessMessage(null);

    if (imageFileUploading) {
      setUpdateUserErrorMessage("Please wait for the image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      if (!token) {
        setUpdateUserErrorMessage("No token found. Please log in.");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/users/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserErrorMessage(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccessMessage("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserErrorMessage(error.message);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setShowModal(false);
    if (confirm("Are you sure? The account will be permanently deleted!")) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(
          `${API_BASE_URL}/api/users/delete/${currentUser?._id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
          alert("Something went wrong!");
        } else {
          dispatch(deleteUserSuccess(data));
          alert(data?.message);
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutFailure(data.message));
        console.error(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/login");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            )}
            <img
              src={
                imageFileUrl ||
                currentUser?.userProfileImg ||
                "default-profile.png"
              }
              alt="user"
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
            />
          </div>
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        {currentUser?.role === "guide" && (
          <Link to="/quiz" className="self-center underline text-green-600">
            Take a quiz and improve your profile
          </Link>
        )}

        {currentUser?.role === "guide" && (
          <TextInput
            type="text"
            id="skill"
            placeholder="Skill"
            value={formData.skill || ""}
            onChange={handleChange}
          />
        )}
      </form>
      <div className="mt-5">
        <Button
          gradientDuoTone="cyanToBlue"
          outline
          onClick={() => setActivePanelId(1)}
          className="w-full mb-3"
        >
          {activePanelId === 1 && "❯"} My Bookings
        </Button>
        <Button
          gradientDuoTone="cyanToBlue"
          outline
          onClick={() => setActivePanelId(2)}
          className="w-full mb-3"
        >
          {activePanelId === 2 && "❯"} Update Profile
        </Button>
        <Button
          gradientDuoTone="cyanToBlue"
          outline
          onClick={() => setActivePanelId(3)}
          className="w-full mb-3"
        >
          {activePanelId === 3 && "❯"} My History
        </Button>
        <div className="text-red-500 flex justify-between mt-5">
          <span onClick={() => setShowModal(true)} className="cursor-pointer">
            Delete Account
          </span>
          <span onClick={handleSignout} className="cursor-pointer">
            Sign Out
          </span>
        </div>
        {updateUserSuccessMessage && (
          <Alert color="success" className="mt-5">
            {updateUserSuccessMessage}
          </Alert>
        )}
        {updateUserErrorMessage && (
          <Alert color="failure" className="mt-5">
            {updateUserErrorMessage}
          </Alert>
        )}
      </div>

      <Modal
        show={showModal}
        size="md"
        popup
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {activePanelId === 1 && <MyBookings />}
      {activePanelId === 2 && <UpdateProfile />}
      {activePanelId === 3 && <MyHistory />}
    </div>
  );
}
