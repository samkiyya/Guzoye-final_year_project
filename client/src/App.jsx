import "./ axios-config"; // Ensure this import is at the top
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Packages from "./pages/Packages";
import Home from "./pages/Home";
import Tours from "./pages/Tours";

import GuzoyeBot from "./pages/user/GuzoyeBot";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
// import DashProfile from "./components/DashProfile";
import Dashboard from "./pages/Dashboard";
import ManagerRoute from "./components/ManagerRoute"; // Fixed import path
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Search from "./pages/Search";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import UpdatePackage from "./pages/manager/UpdatePackage";
import Schedule from "./pages/Schedule";
import About from "./pages/About";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";
import DashUsers from "./components/DashUsers";
import Footer from "./components/Footer/Footer";
import CreateSchedule from "./pages/ScheduleForm";
import Quiz from "./pages/Quiz";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/createSchedule" element={<CreateSchedule />} />
            <Route path="/quiz" element={<Quiz />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="" element={<DashUsers />} />
            <Route path="all-users" element={<Dashboard />} />
          </Route>
          <Route element={<ManagerRoute />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="all-packages" element={<ManagerDashboard />} />
            <Route path="add-package" element={<ManagerDashboard />} />
            <Route path="update-package" element={<ManagerDashboard />} />
            <Route path="update-package/:id" element={<UpdatePackage />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/package/:id" element={<Package />} />
          <Route path="/package/ratings/:id" element={<RatingsPage />} />
          <Route path="/booking/:packageId" element={<PrivateRoute />}>
            <Route path="" element={<Booking />} />
          </Route>
        </Routes>
        <GuzoyeBot />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
