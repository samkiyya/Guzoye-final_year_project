import { useEffect, useState } from "react";
import { FaCalendar, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import { useNavigate } from "react-router";
import TourCard from "./TourCard";
import "./Tours.css";

const Tours = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const navigate = useNavigate();
  const [topTours, setTopTours] = useState([]);
  const [latestTours, setLatestTours] = useState([]);
  const [offerTours, setOfferTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getTopTours = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/tour/search/getTourBySearch?sort=reviews&limit=8`
      );
      const data = await res.json();
      if (data?.success) {
        setTopTours(data?.data);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLatestTours = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/tour?sort=createdAt&limit=8`
      );
      const data = await res.json();
      if (data?.success) {
        setLatestTours(data?.data);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOfferTours = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/tour/search/getTourBySearch?sort=createdAt&offer=true&limit=6`
      );
      const data = await res.json();
      if (data?.success) {
        setOfferTours(data?.data);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopTours();
    getLatestTours();
    getOfferTours();
  }, []);

  return (
    <div className="main w-full">
      <div className="w-full flex flex-col">
        <div className="backaground_image w-full"></div>
        <div className="top-part w-full gap-2 flex flex-col">
          <h1 className="text-white text-sm text-center xsm:text-lg font-semibold">
            Explore Our Amazing Tour Destinations
          </h1>
          <div className="w-full flex justify-center items-center gap-2 mt-8">
            <input
              type="text"
              className="rounded-lg outline-none w-[230px] sm:w-2/5 p-2 border border-black bg-opacity-40 bg-white text-white placeholder:text-white font-semibold"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <button
              onClick={() => {
                navigate(`/search?searchTerm=${search}`);
              }}
              className="bg-white w-10 h-10 flex justify-center items-center text-xl font-semibold rounded-full hover:scale-95"
            >
              Go
            </button>
          </div>
          <div className="w-[90%] max-w-xl flex justify-center mt-10">
            <button
              onClick={() => {
                navigate("/search?offer=true");
              }}
              className="flex items-center justify-around gap-x-1 bg-slate-400 text-white p-2 py-1 text-[8px] xxsm:text-sm sm:text-lg border-e border-white rounded-s-full flex-1 hover:scale-105 transition-all duration-150"
            >
              Best Offers
              <LuBadgePercent className="text-2xl" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=reviews");
              }}
              className="flex items-center justify-around gap-x-1 bg-slate-400 text-white p-2 py-1 text-[8px] xxsm:text-sm sm:text-lg border-x border-white flex-1 hover:scale-105 transition-all duration-150"
            >
              Top Rated
              <FaStar className="text-2xl" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=createdAt");
              }}
              className="flex items-center justify-around gap-x-1 bg-slate-400 text-white p-2 py-1 text-[8px] xxsm:text-sm sm:text-lg border-x border-white flex-1 hover:scale-105 transition-all duration-150"
            >
              Latest
              <FaCalendar className="text-lg" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=reviews");
              }}
              className="flex items-center justify-around gap-x-1 bg-slate-400 text-white p-2 py-1 text-[8px] xxsm:text-sm sm:text-lg border-s border-white rounded-e-full flex-1 hover:scale-105 transition-all duration-150"
            >
              Most Rated
              <FaRankingStar className="text-2xl" />
            </button>
          </div>
        </div>
        {/* main page */}
        <div className="main p-6 flex flex-col gap-5">
          {loading && <h1 className="text-center text-2xl">Loading...</h1>}
          {!loading &&
            topTours.length === 0 &&
            latestTours.length === 0 &&
            offerTours.length === 0 && (
              <h1 className="text-center text-2xl">No Tours Yet!</h1>
            )}
          {/* Top Rated */}
          {!loading && topTours.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Top Tours</h1>
              <div className="flex flex-wrap gap-2 my-3">
                {topTours.map((tourData, i) => {
                  return <TourCard key={i} tourData={tourData} />;
                })}
              </div>
            </>
          )}
          {/* Top Rated */}
          {/* latest */}
          {!loading && latestTours.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Latest Tours</h1>
              <div className="flex flex-wrap gap-2 my-3">
                {latestTours.map((tourData, i) => {
                  return <TourCard key={i} tourData={tourData} />;
                })}
              </div>
            </>
          )}
          {/* latest */}
          {/* offer */}
          {!loading && offerTours.length > 0 && (
            <>
              <div className="offers_img"></div>
              <h1 className="text-2xl font-semibold">Best Offers</h1>
              <div className="flex flex-wrap gap-2 my-3">
                {offerTours.map((tourData, i) => {
                  return <TourCard key={i} tourData={tourData} />;
                })}
              </div>
            </>
          )}
          {/* offer */}
        </div>
      </div>
    </div>
  );
};

export default Tours;
