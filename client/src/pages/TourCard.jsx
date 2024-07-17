import React from "react";
import { Rating } from "@mui/material";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Assuming StarIcon is imported from @mui/icons-material
import StarIcon from "@mui/icons-material/Star";

const TourCard = ({ tourData }) => {
  const [value, setValue] = React.useState(2); // Example initial value

  const getLabelText = (value) => {
    return `You are rating ${value}`;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Link to={`/tours/${tourData?._id}`} className="w-max">
      <div className="bg-white border flex flex-col items-center p-3 rounded shadow-md overflow-hidden">
        <img
          className="w-[300px] h-[190px] rounded border hover:scale-110 transition-all duration-300"
          src={tourData?.photo[0]}
          alt={`Tour Image of ${tourData?.title}`}
        />
        <div className="w-full flex flex-col my-2">
          <p className="font-semibold text-lg capitalize w-[90%] xsm:w-[250px]">
            {tourData?.title}
          </p>
          <p className="text-green-700 text-lg capitalize">{tourData?.city}</p>
          <p className="flex text-lg items-center gap-2">
            <FaClock /> {`${tourData?.distance} km`}
          </p>
          <div className="flex flex-wrap justify-between">
            <p className="flex items-center text-lg">
              <Rating
                name="hover-feedback"
                value={value}
                precision={0.5}
                getLabelText={getLabelText}
                onChange={handleChange}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              ({tourData?.reviews?.length})
            </p>
            <p className="flex gap-1">
              <span className="line-through text-gray-700">
                ${tourData?.price}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

TourCard.propTypes = {
  tourData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    photo: PropTypes.arrayOf(PropTypes.string).isRequired,
    reviews: PropTypes.arrayOf(PropTypes.string).isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default TourCard;
