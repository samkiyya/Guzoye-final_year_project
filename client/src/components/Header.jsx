import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/auth/authSlice";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useState } from "react"; // Import useState for managing menu state

const nav__links = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/tours",
    display: "Tours",
  },
  {
    path: "/packages",
    display: "Packages",
  },
  {
    path: "/contact-us",
    display: "Contact Us",
  },
  {
    path: "/map",
    display: "Nearby",
  },
];

const Header = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  // State for managing menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to open menu
  const openMenu = () => {
    setIsMenuOpen(true);
  };

  // Function to close menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <Navbar className="sticky top-0 z-10 w-100 py-3 px-4 bg-green-400 dark:bg-green-500 sm:px-10 md:px-16 md:py-5">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-black text-lg sm:text-xl font-semibold"
        >
          <span className="px-2">ጉZOዬ</span>
        </Link>

        <div className="hidden sm:flex flex-row gap-10">
          {nav__links.map((item, index) => (
            <Link key={index} to={item.path}>
              {item.display}
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            className="self-center w-8 h-8 rounded-full sm:inline sm:w-10 sm:h-10"
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
          <img
            src="./icons/menu.png"
            alt="Menu"
            className="self-center w-7 h-7 hover:cursor-pointer sm:hidden"
            onClick={openMenu}
          />
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="hidden sm:inline w-12">
                  <Avatar alt="user" img={currentUser.userProfileImg} rounded />
                </div>
              }
              className="hidden sm:inline p-5"
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Link to="/dashboard?tab=profile&panelId=1">
                <Dropdown.Item>My Bookings</Dropdown.Item>
              </Link>
              <Link to="/schedule">
                <Dropdown.Item>My Schedule</Dropdown.Item>
              </Link>
              {currentUser.role === "guide" && (
                <Link to="/quiz">
                  <Dropdown.Item>Take a quiz</Dropdown.Item>
                </Link>
              )}
              <Link to="/dashboard?tab=profile&panelId=2">
                <Dropdown.Item>Update Profile</Dropdown.Item>
              </Link>
              <Link to="/dashboard?tab=profile&panelId=3">
                <Dropdown.Item>My History</Dropdown.Item>
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
      <div
        id="mobileNav"
        className={`z-40 flex flex-col w-full h-full py-16 absolute top-0 left-0 bg-green-400 dark:bg-green-500 sm:hidden ${
          isMenuOpen ? "visible" : "hidden"
        }`}
      >
        <Link
          to="/"
          className="absolute top-3 left-6 whitespace-nowrap text-black text-lg font-semibold"
          onClick={closeMenu}
        >
          ጉZOዬ
        </Link>
        <Link
          to="/"
          className="absolute top-5 right-20 whitespace-nowrap text-black text-sm font-semibold"
          onClick={() => {
            closeMenu();
            handleSignout();
          }}
        >
          Logout
        </Link>
        <img
          src="./icons/closeButton.png"
          alt="Close"
          className="absolute w-8 h-8 top-3 right-8 hover:cursor-pointer"
          onClick={closeMenu}
        />
        <div className="flex flex-col gap-3 self-center">
          {nav__links.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="w-48 border-b-2 border-gray-700 text-left text-black font-semibold"
              onClick={closeMenu}
            >
              {item.display}
            </Link>
          ))}
        </div>
        <div className="self-center mt-3 flex">
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="w-48 border-b-2 border-gray-700 text-left text-black font-semibold flex flex-row justify-between">
                  <p className="e">My profile</p>
                  <img
                    src="./icons/expandArrow.png"
                    alt="Expand"
                    className="w-5 h-5 self-center"
                  />
                </div>
              }
              className="px-5 py-1 bg-green-400 dark:bg-green-500 border-none"
            >
              <Link to="/profile/user" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  View Profile
                </Dropdown.Item>
              </Link>
              <Link to="/my-bookings" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  My Bookings
                </Dropdown.Item>
              </Link>
              <Link to="/my-schedule" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  My Schedule
                </Dropdown.Item>
              </Link>
              <Link to="/my-history" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  My History
                </Dropdown.Item>
              </Link>
            </Dropdown>
          ) : (
            <>
              <Button
                gradientDuoTone="purpleToBlue"
                className="text-left text-black mt-3 dark:text-black font-semibold"
                onClick={closeMenu}
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                className="text-left text-black mt-3 dark:text-black font-semibold"
                onClick={closeMenu}
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
