import React from "react";
import { Rating } from "@mui/material";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

// Assuming StarIcon is imported from @mui/icons-material
import StarIcon from "@mui/icons-material/Star";

const PackageCard = ({ packageData }) => {
  const [value, setValue] = React.useState(2); // Example initial value

  const getLabelText = (value) => {
    return `You are rating ${value}`;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Link to={`/package/${packageData._id}`} className="w-max">
      <div className="bg-white border flex flex-col items-center p-3 rounded shadow-md overflow-hidden">
        <img
          className="w-[300px] h-[190px] rounded border hover:scale-110 transition-all duration-300"
          src={packageData.packageImages[0]}
          alt={`Package Image of ${packageData.packageName}`}
        />
        <div className="w-full flex flex-col my-2">
          <p className="font-semibold text-lg capitalize w-[90%] xsm:w-[250px]">
            {packageData.packageName}
          </p>
          <p className="text-green-700 text-lg capitalize">
            {packageData.packageDestination}
          </p>
          <p className="flex text-lg items-center gap-2">
            <FaClock />{" "}
            {`${packageData.packageDays} ${
              packageData.packageDays > 1 ? "Days" : "Day"
            } - ${packageData.packageNights} ${
              packageData.packageNights > 1 ? "Nights" : "Night"
            }`}
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
              ({packageData.packageTotalRatings})
            </p>
            <p className="flex gap-1">
              <span className="line-through text-gray-700">
                ${packageData.packagePrice}
              </span>
              -
              <span className="font-medium text-green-700">
                ${packageData.packageDiscountPrice}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

PackageCard.propTypes = {
  packageData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired,
    packageDestination: PropTypes.string.isRequired,
    packageDays: PropTypes.number.isRequired,
    packageNights: PropTypes.number.isRequired,
    packageImages: PropTypes.arrayOf(PropTypes.string).isRequired,
    packageTotalRatings: PropTypes.number.isRequired,
    packageRating: PropTypes.number.isRequired,
    offer: PropTypes.bool,
    packageDiscountPrice: PropTypes.number,
    packagePrice: PropTypes.number.isRequired,
  }).isRequired,
};

export default PackageCard;
