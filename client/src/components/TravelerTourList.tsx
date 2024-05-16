import React, { useState, useEffect } from "react";
import axios from "axios";

interface Tour {
  _id: string;
  title: string;
  city: string;
  address: string;
  distance: number;
  desc: string;
  price: number;
  featured: boolean;
  reviews: string[];
  photo: string[];
}

const TravelerTourList: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("/api/tours");
        if (Array.isArray(response.data)) {
          setTours(response.data);
        } else {
          console.error("Expected array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  return (
    <div>
      <h1>Available Tours</h1>
      <ul>
        {tours.map((tour) => (
          <li key={tour._id}>
            <h2>{tour.title}</h2>
            <p>{tour.city}</p>
            <p>{tour.address}</p>
            <p>{tour.distance} km</p>
            <p>{tour.desc}</p>
            <p>${tour.price}</p>
            <p>{tour.featured ? "Featured" : "Not Featured"}</p>
            <div>
              {tour.photo.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={tour.title}
                  style={{ width: "100px", height: "100px" }}
                />
              ))}
            </div>
            <button>Book Now</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TravelerTourList;
