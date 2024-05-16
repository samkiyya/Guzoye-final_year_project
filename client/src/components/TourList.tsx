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

const TourList: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("/api/tours");
        if (Array.isArray(response.data)) {
          setTours(response.data);
        } else {
          console.error("Expected array but got:", response.data);
          setMessage("Error fetching tours");
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
        setMessage("Error fetching tours");
      }
    };

    fetchTours();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/tours/${id}`);
      setTours(tours.filter((tour) => tour._id !== id));
      setMessage("Tour deleted successfully");
    } catch (error) {
      setMessage("Error deleting tour");
      console.error("Error deleting tour:", error);
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<Tour>) => {
    try {
      const response = await axios.put(`/api/tours/${id}`, updatedData);
      setTours(tours.map((tour) => (tour._id === id ? response.data : tour)));
      setMessage("Tour updated successfully");
    } catch (error) {
      setMessage("Error updating tour");
      console.error("Error updating tour:", error);
    }
  };

  return (
    <div>
      <h1>Tour List for Admin</h1>
      {message && <p>{message}</p>}
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
            <button onClick={() => handleDelete(tour._id)}>Delete</button>
            <button
              onClick={() => handleUpdate(tour._id, { title: "Updated Title" })}
            >
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourList;
