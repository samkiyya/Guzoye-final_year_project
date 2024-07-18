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
// import BookingHistory from "./../pages/manager/BookingHistory";
// import PaymentHistory from "./../pages/manager/PaymentHistory";
// import TourHistory from "./../pages/manager/TourHistory";
// import TourDetail from "./../pages/manager/TourDetail";
import AddTour from "./../pages/manager/AddTour";
import RatingsPage from "./../pages/RatingsPage";
import PrivateRoute from "./../components/privateRoutes/PrivateRoute";
import ManagerRoute from "./../components/privateRoutes/ManagerRoute";
import AdminRoute from "./../components/privateRoutes/AdminRoute";
import ToursDetail from "./../pages/TourDetail";
import DashUsers from "./../components/DashUsers";
import MAP from "../pages/MAP/Index";
import ReturnPage from "./../components/ReturnPage";
// import PaymentButton from "../components/PaymentButton";

const Routers = () => {
  return (
    <Routes>
      {/* <Route
        path="/"
        element={
          <PaymentButton
            bookingReference="12345"
            amount="1000"
            email="user@example.com"
            firstName="John"
            packageName="Holiday Package"
          />
        }
      /> */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<ToursDetail />} />

      <Route path="/packages" element={<Packages />} />
      <Route path="/booking/:Id" element={<Booking />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/about" element={<About />} />
      <Route path="/map" element={<MAP />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/createSchedule" element={<CreateSchedule />} />
        <Route path="/quiz" element={<Quiz />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/all-users" element={<DashUsers />} />
      </Route>
      <Route element={<ManagerRoute />}>
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/all-packages" element={<ManagerDashboard />} />
        <Route path="/add-package" element={<ManagerDashboard />} />
        <Route path="/add-tour" element={<AddTour />} />
        <Route path="/update-package/:id" element={<UpdatePackage />} />
      </Route>
      <Route path="/package/ratings/:id" element={<RatingsPage />} />
      <Route path="/payment/return" element={<ReturnPage />} />
    </Routes>
  );
};

export default Routers;
