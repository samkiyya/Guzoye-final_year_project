import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/auth/authSlice";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useState, useEffect } from "react";

const navLinks = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Tours" },
  { path: "/packages", display: "Packages" },
  { path: "/contact-us", display: "Contact Us" },
  { path: "/map", display: "Nearby" },
];

const Header = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  // State for managing menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <>
      <Navbar className="sticky top-0 z-10 w-full py-3 px-4 bg-green-400 dark:bg-green-500 sm:px-10 md:px-16 md:py-5">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-black text-lg sm:text-xl font-semibold"
        >
          <span className="px-2">ጉZOዬ</span>
        </Link>

        <div className="hidden sm:flex flex-row gap-10">
          {navLinks.map((item, index) => (
            <Link key={index} to={item.path}>
              {item.display}
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            className="w-8 h-8 rounded-full sm:w-10 sm:h-10"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>
          <img
            src="./icons/menu.png"
            alt="Menu"
            className="w-7 h-7 cursor-pointer sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                  <Dropdown.Item>Take a Quiz</Dropdown.Item>
                </Link>
              )}
              <Link to="/dashboard?tab=profile&panelId=2">
                <Dropdown.Item>Update Profile</Dropdown.Item>
              </Link>
              <Link to="/dashboard?tab=profile&panelId=3">
                <Dropdown.Item>My History</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleSignout()}>
                Sign Out
              </Dropdown.Item>
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

      {/* Mobile Menu */}
      <div
        id="mobileNav"
        className={`fixed top-0 left-0 z-40 w-full h-full py-16 bg-green-400 dark:bg-green-500 transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          to="/"
          className="absolute top-3 left-6 whitespace-nowrap text-black text-lg font-semibold"
          onClick={() => setIsMenuOpen(false)}
        >
          ጉZOዬ
        </Link>
        <img
          src="./icons/closeButton.png"
          alt="Close"
          className="absolute w-8 h-8 top-3 right-8 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        />
        <div className="flex flex-col gap-3 mt-12">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block w-48 border-b-2 border-gray-700 text-left text-black font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.display}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-3">
          {currentUser ? (
            <>
              <Link to="/profile/user" onClick={() => setIsMenuOpen(false)}>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="text-left text-black font-semibold"
                >
                  View Profile
                </Button>
              </Link>
              <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)}>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="text-left text-black font-semibold"
                >
                  My Bookings
                </Button>
              </Link>
              <Link to="/my-schedule" onClick={() => setIsMenuOpen(false)}>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="text-left text-black font-semibold"
                >
                  My Schedule
                </Button>
              </Link>
              <Link to="/my-history" onClick={() => setIsMenuOpen(false)}>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="text-left text-black font-semibold"
                >
                  My History
                </Button>
              </Link>
              <Button
                gradientDuoTone="purpleToBlue"
                className="text-left text-black font-semibold"
                onClick={() => handleSignout()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="text-left text-black font-semibold"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="text-left text-black font-semibold"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
