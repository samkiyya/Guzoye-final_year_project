import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`/api/tours/${id}`);
        setTour(res.data.data);
      } catch (err) {
        setError("Failed to fetch tour details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {tour ? (
        <div>
          <h1>{tour.title}</h1>
          <img src={tour.photo[0]} alt={tour.title} />
          <p>{tour.desc}</p>
          <p>City: {tour.city}</p>
          <p>Address: {tour.address}</p>
          <p>Distance: {tour.distance} km</p>
          <p>Price: ${tour.price}</p>
          <p>Max Group Size: {tour.maxGroupSize}</p>
          <p>Featured: {tour.featured ? "Yes" : "No"}</p>
          <p>Reviews: {tour.reviews.length}</p>
        </div>
      ) : (
        <div>No tour found</div>
      )}
    </div>
  );
};

export default TourDetail;
