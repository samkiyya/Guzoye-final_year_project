import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { toggleTheme } from "../redux/theme/themeSlice";

export default function Header() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/logout`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.status !== 200) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="border-b-2 px-16">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
      >
        <span className="px-2 py-1">ጉZOዬ</span>
      </Link>

      <div className="flex flex-row gap-10">
        <Link to="/">Home</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="flex gap-2">
        <Button
          className="w-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaSun className="mx-auto" />
          ) : (
            <FaMoon className="mx-auto" />
          )}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="w-12">
                <Avatar alt="user" img={currentUser.photo} rounded />
              </div>
            }
            className="p-5"
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/profile/traveler">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Link to="/my-bookings">
              <Dropdown.Item>My Bookings</Dropdown.Item>
            </Link>
            <Link to="/my-history">
              <Dropdown.Item>My History</Dropdown.Item>
            </Link>
            <Link to="/update-profile">
              <Dropdown.Item>Update Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Link to="/login">
              <Button gradientDuoTone="purpleToBlue" className="text-black">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button gradientDuoTone="purpleToBlue" className="text-black">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </Navbar>
  );
}
