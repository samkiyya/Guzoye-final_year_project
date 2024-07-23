import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../spinner";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login?redirect=" + location.pathname);
    } else {
      setLoading(false);
    }
  }, [currentUser, location, navigate]);

  if (loading) return <Spinner path="/login" />;

  return <Outlet />;
};

export default PrivateRoute;
