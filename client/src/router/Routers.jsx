import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./../pages/Home";
import Tours from "./../pages/Tours";
import Packages from "./../pages/Packages";
import Booking from "./../pages/user/Booking";
import Login from "./../pages/auth/Login";
import Register from "./../pages/auth/Registration";
import SearchResultList from "./../pages/Search";
import About from "./../pages/About";
import Dashboard from "./../pages/Dashboard";
import Schedule from "./../pages/Schedule";
import CreateSchedule from "./../pages/ScheduleForm";
import Quiz from "./../pages/Quiz";
import ManagerDashboard from "./../pages/manager/ManagerDashboard";
import UpdatePackage from "./../pages/manager/UpdatePackage";
import AddTour from "./../pages/manager/AddTour";
import RatingsPage from "./../pages/RatingsPage";
import PrivateRoute from "./../components/privateRoutes/PrivateRoute";
import ManagerRoute from "./../components/privateRoutes/ManagerRoute";
import AdminRoute from "./../components/privateRoutes/AdminRoute";
import ToursDetail from "./../pages/TourDetail";
import Contact from "./../pages/Contact";
import DashUsers from "./../components/DashUsers";
import DashProfile from "./../components/DashProfile";
import MAP from "../pages/MAP/Index";
import ReturnPage from "./../components/ReturnPage";
import Search from "../pages/Search";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<ToursDetail />} />
      <Route path="tours/search" element={<Search />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/booking/:Id" element={<Booking />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/map" element={<MAP />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Nested dashboard routes */}
          <Route path="profile" element={<DashProfile />} />
          <Route path="users" element={<DashUsers />} />
        </Route>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/createSchedule" element={<CreateSchedule />} />
        <Route path="/quiz" element={<Quiz />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/users" element={<DashUsers />} />
      </Route>

      {/* Manager Routes */}
      <Route element={<ManagerRoute />}>
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/packages" element={<ManagerDashboard />} />
        <Route path="/manager/add-tour" element={<AddTour />} />
        <Route path="/manager/update-package/:id" element={<UpdatePackage />} />
      </Route>

      <Route path="/package/ratings/:id" element={<RatingsPage />} />
      <Route path="/payment/return" element={<ReturnPage />} />
    </Routes>
  );
};

export default Routers;
