import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "./Spinner"; // Ensure this path is correct

export default function PrivateRoute() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  const authCheck = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/user-auth`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.check) setOk(true);
      else setOk(false);
    } catch (error) {
      setOk(false);
    }
  };

  useEffect(() => {
    if (currentUser !== null) authCheck();
  }, [currentUser]);

  if (currentUser === null) {
    return <Navigate to="/login" />;
  }

  return ok ? <Outlet /> : <Spinner />;
}
