import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "./../spinner"; // Fixed import path

export default function ManagerRoute() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  const authCheck = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/manager-auth`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
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
