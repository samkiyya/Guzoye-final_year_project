import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";
import jwtDecode from "jwt-decode";
export const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let isGuide = false;
  let status = "traveler";
  if (token) {
    const decoded = jwtDecode(token);
    const { username, role } = decoded.userInfo;
    isManager = role.include("manager");
    isAdmin = role.include("admin");
    isGuide = role.include("guide");
    if (isAdmin) status = "Admin";
    if (isManager) status = "Manager";
    if (isGuide) status = "Guide";
    return { username, role, status, isManager, isAdmin, isGuide };
  }
  return { username: "", role: [], isManager, isGuide, isAdmin, status };
};
