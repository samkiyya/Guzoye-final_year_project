import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiOutlineUserGroup,
  HiChartPie,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();

  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const whichUser = () => {
    if (currentUser.role === "admin") {
      return "Admin";
    } else if (currentUser.role === "manager") {
      return "Manager";
    } else {
      if (currentUser.role === "guide") {
        return "Guide";
      } else {
        return "User";
      }
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/logout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.role == "admin" && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
                className="hover:bg-gray-400"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.role == "manager" && (
            <Link to="/dashboard?tab=manager">
              <Sidebar.Item
                active={tab === "manager" || !tab}
                icon={HiChartPie}
                as="div"
                className="hover:bg-gray-400"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={whichUser()}
              labelColor="dark"
              as="div"
              className="hover:bg-gray-400"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.role == "admin" && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
                className="hover:bg-gray-400"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            onClick={handleSignout}
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
