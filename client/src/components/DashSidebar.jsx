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
  const { currentUser } = useSelector((state) => state.auth); // Ensure the correct state selector

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Define role-based sidebar items
  const sidebarItems = {
    admin: [
      { to: "/dashboard?tab=dash", icon: HiChartPie, label: "Dashboard" },
      { to: "/dashboard?tab=users", icon: HiOutlineUserGroup, label: "Users" },
    ],
    manager: [
      { to: "/dashboard?tab=manager", icon: HiChartPie, label: "Dashboard" },
    ],
    guide: [{ to: "/dashboard?tab=profile", icon: HiUser, label: "Profile" }],
    user: [{ to: "/dashboard?tab=profile", icon: HiUser, label: "Profile" }],
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Sign out failed:", data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/login");
      }
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  // Ensure currentUser is defined before rendering sidebar items
  if (!currentUser) {
    return <div>Loading...</div>; // or any other placeholder UI
  }

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {sidebarItems[currentUser.role]?.map((item) => (
            <Link key={item.to} to={item.to}>
              <Sidebar.Item
                active={tab === item.to.split("?tab=")[1] || !tab}
                icon={item.icon}
                as="div"
                className="hover:bg-gray-400"
                aria-label={item.label}
              >
                {item.label}
              </Sidebar.Item>
            </Link>
          ))}
          <Sidebar.Item
            onClick={handleSignout}
            icon={HiArrowSmRight}
            className="cursor-pointer"
            aria-label="Sign Out"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
