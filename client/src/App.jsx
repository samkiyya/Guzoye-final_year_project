import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/Login";
import SignUp from "./pages/Registration";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ManagerRoute from "./pages/Routes/ManagerRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Search from "./pages/Search";
import NewPackagePage from "./pages/newPackagePage/newPackage";
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        {/* Adjusted traveler route */}
        <Route
          path="/profile/traveler"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Adjusted admin route */}
        <Route
          path="/profile/create-package"
          element={
            <OnlyAdminPrivateRoute>
              <NewPackagePage />
            </OnlyAdminPrivateRoute>
          }
        />

        {/* Adjusted manager route */}
        <Route
          path="/profile/admin"
          element={
            <ManagerRoute>
              <ManagerDashboard />
            </ManagerRoute>
          }
        />
        <Route
          path="/profile/admin/update-package/:id"
          element={
            <ManagerRoute>
              <UpdatePackage />
            </ManagerRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/package/:id" element={<Package />} />
        <Route path="/package/ratings/:id" element={<RatingsPage />} />
        {/* Adjusted booking route */}
        <Route
          path="/booking/:packageId"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
