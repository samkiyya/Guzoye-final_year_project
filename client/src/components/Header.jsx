import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/auth/authSlice";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useState, useEffect } from "react";
import "./Header.css";

const navLinks = [
  { path: "/", display: "Home" },
  { path: "/tours", display: "Tours" },
  { path: "/packages", display: "Packages" },
  { path: "/map", display: "Nearby" },

  { path: "/about", display: "About" },

  { path: "/contact-us", display: "Contact Us" },
];

const Header = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  // State for managing menu visibility
  const setIsMenuOpen = useState(false);

  useEffect(() => {
    // This effect can be used for any additional setup if needed
  }, [dispatch, currentUser]);

  const handleSignout = async () => {
    dispatch(signoutStart()); // Start signout process
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
      if (response.ok) {
        localStorage.removeItem("currentUser");
        dispatch(signoutSuccess()); // Success
        navigate("/login");
      } else {
        console.error("Logout failed");
        dispatch(signoutFailure("Logout failed")); // Failure
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      dispatch(signoutFailure(error.message)); // Failure
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
      {" "}
      {(onload = closeMenu)}
      <Navbar className="sticky top-0 z-10 w-100 py-3 px-4 bg-green-400 dark:bg-green-500 sm:px-10 md:px-16 md:py-5">
        {/** logo start */}

        <NavLink
          to="/"
          className="self-center whitespace-nowrap text-black text-lg sm:text-xl font-semibold"
        >
          <span className="px-2">ጉZOዬ</span>
        </NavLink>
        {/** logo end */}

        {/** menu/nav start */}
        <div className=" hidden sm:flex flex-row gap-10">
          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to={item.path}
            >
              {item.display}
            </NavLink>
          ))}
        </div>
        {/** menu/nav end */}

        <div className="flex me-4">
          <Button
            className="self-center w-8 h-8 rounded-full sm:inline sm:w-10 sm:h-10 md:me-6"
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
            className=" self-senter w-7 h-7 ms-4 hover:cursor-pointer sm:hidden"
            onClick={{ openMenu }}
          />
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="hidden sm:inline w-12">
                  <Avatar
                    alt="Traveler"
                    img={currentUser.userProfileImg}
                    rounded
                  />
                </div>
              }
              className="hidden sm:inline p-5"
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
              </Dropdown.Header>
              <NavLink to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </NavLink>
              <NavLink to="/dashboard?tab=profile&panelId=1">
                <Dropdown.Item>My Bookings</Dropdown.Item>
              </NavLink>
              <NavLink to="/schedule">
                <Dropdown.Item>My Schedule</Dropdown.Item>
              </NavLink>
              {currentUser.role === "guide" && (
                <NavLink to="/quiz">
                  <Dropdown.Item>Take a Quiz</Dropdown.Item>
                </NavLink>
              )}
              <NavLink to="/dashboard?tab=profile&panelId=2">
                <Dropdown.Item>Update Profile</Dropdown.Item>
              </NavLink>
              <NavLink to="/dashboard?tab=profile&panelId=3">
                <Dropdown.Item>My History</Dropdown.Item>
              </NavLink>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleSignout()}>
                Sign Out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/login"
              >
                <Button className="text-black hidden md:inline-block border-0">
                  Login
                </Button>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/register"
              >
                <Button className="text-black  hidden md:inline-block mt-1 border-black bg-red-600 border-0">
                  Register
                </Button>
              </NavLink>
            </>
          )}
        </div>
      </Navbar>
      {/* Mobile Menu */}
      <div
        id="mobileNav"
        className=" fixed z-40 flex flex-col w-full h-full py-16 top-0 left-0 bg-green-400 dark:bg-green-500 sm:hidden"
      >
        <NavLink
          to="/"
          className="absolute top-3 left-6 whitespace-nowrap text-black text-lg font-semibold"
          onClick={closeMenu}
        >
          ጉZOዬ
        </NavLink>
        <NavLink
          to="/"
          className="absolute top-5 right-20 whitespace-nowrap text-black text-sm font-semibold"
          onClick={() => {
            closeMenu();
            handleSignout();
          }}
        >
          Logout
        </NavLink>
        <img
          src="./icons/closeButton.png"
          alt="Close"
          className="absolute w-8 h-8 top-3 right-8 hover:cursor-pointer"
          onClick={closeMenu}
        />
        <div className="flex flex-col gap-3 self-center">
          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="w-48 border-b-2 border-gray-700 text-left text-black font-semibold"
              onClick={closeMenu}
            >
              {item.display}
            </NavLink>
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
              <NavLink to="/profile/user" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  View Profile
                </Dropdown.Item>
              </NavLink>
              <NavLink to="/my-bookings" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  My Bookings
                </Dropdown.Item>
              </NavLink>
              <NavLink to="/my-schedule" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  My Schedule
                </Dropdown.Item>
              </NavLink>
              <NavLink to="/my-history" onClick={closeMenu}>
                <Dropdown.Item className="text-black dark:text-black font-semibold">
                  My History
                </Dropdown.Item>
              </NavLink>
            </Dropdown>
          ) : (
            <>
              {" "}
              <Button
                gradientDuoTone="purpleToBlue"
                className="text-left text-black mt-3 dark:text-black font-semibold"
              >
                <NavLink to="/login" onClick={closeMenu}>
                  Sign In
                </NavLink>
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                className="text-left text-black   mt-3 dark:text-black font-semibold"
              >
                <NavLink to="/register" onClick={closeMenu}>
                  Register
                </NavLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
