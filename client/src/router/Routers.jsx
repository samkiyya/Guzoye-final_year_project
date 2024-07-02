import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./../pages/Home";
import Tour from "./../pages/Tours";
import TourDetails from "./../pages/TourCard";
import Login from "./../pages/Login";
import Register from "./../pages/Registration";
import SearchResultList from "./../pages/Search";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tour />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tours/search" element={<SearchResultList />} />
    </Routes>
  );
};

export default Routers;
