import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/Login";
import SignUp from "./pages/Registration";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ManagerRoute from "./components/ManagerRoute"; // Fixed import path
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Search from "./pages/Search";
import NewPackagePage from "./pages/newPackagePage/NewPackage"; // Fixed import path
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import UpdatePackage from "./pages/manager/UpdatePackage";
import About from "./pages/About";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/search" element={<Search />} />

        <Route path="/profile/traveler" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="/profile/admin" element={<OnlyAdminPrivateRoute />}>
          <Route index element={<NewPackagePage />} />
        </Route>

        <Route path="/profile/manager" element={<ManagerRoute />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="update-package/:id" element={<UpdatePackage />} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/package/:id" element={<Package />} />
        <Route path="/package/ratings/:id" element={<RatingsPage />} />

        <Route path="/booking/:packageId" element={<PrivateRoute />}>
          <Route index element={<Booking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
