import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { toggleTheme } from "../redux/theme/themeSlice";

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
];
const Header = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();
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
        navigate("/");
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
        {nav__links.map((item, index) => (
          <Link key={index} to={item.path}>
            {item.display}
          </Link>
        ))}
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
                <Avatar alt="user" img={currentUser.userProfileImg} rounded />
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
            <Link to="/profile/user">
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
            <Button gradientDuoTone="purpleToBlue" className="text-black">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button gradientDuoTone="purpleToBlue" className="text-black">
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </Navbar>
  );
};
export default Header;
