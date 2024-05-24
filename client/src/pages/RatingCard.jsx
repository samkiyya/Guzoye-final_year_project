import { Rating } from "@mui/material";
import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import PropTypes from "prop-types";

const defaultProfileImg = "path_to_default_image"; // Define the path to your default profile image

const RatingCard = ({ packageRatings }) => {
  const [expandedReviewIndex, setExpandedReviewIndex] = useState(null);

  return (
    <>
      {packageRatings &&
        packageRatings.map((rating, i) => (
          <div
            key={i}
            className="main relative w-max min-w-[280px] max-w-[280px] rounded-lg border p-3 gap-2 flex flex-col"
            id="main"
          >
            <div className="flex gap-2 items-center">
              <img
                src={rating.userProfileImg || defaultProfileImg}
                alt={rating.username[0]}
                className="border w-6 h-6 border-black rounded-[50%]"
              />
              <p className="font-semibold">{rating.username}</p>
            </div>
            <Rating
              value={rating.rating || 0}
              readOnly
              size="small"
              precision={0.1}
            />
            {/* review */}
            <p className="break-all">
              <span
                className="break-all"
                id={rating.review.length > 90 ? "review-text" : "none"}
              >
                {rating.review !== ""
                  ? rating.review.length > 90
                    ? rating.review.substring(0, 45)
                    : rating.review
                  : rating.rating < 3
                  ? "Not Bad"
                  : "Good"}
              </span>
              {rating.review.length > 90 && (
                <button
                  id="more-btn"
                  className={`m-1 font-semibold items-center gap-1 flex`}
                  onClick={() => setExpandedReviewIndex(i)}
                >
                  More
                  <FaArrowDown />
                </button>
              )}
            </p>
            {/* full review */}
            {expandedReviewIndex === i && (
              <div className="bg-white absolute left-0 top-0 popup z-50 p-3 border rounded-lg">
                <div
                  key={`popup-${i}`}
                  className="relative w-max min-w-[280px] max-w-[280px] rounded-lg border p-3 gap-2 flex flex-col"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={rating.userProfileImg || defaultProfileImg}
                      alt={rating.username[0]}
                      className="border w-6 h-6 border-black rounded-[50%]"
                    />
                    <p className="font-semibold">{rating.username}</p>
                  </div>
                  <Rating
                    value={rating.rating || 0}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  {/* review */}
                  <p className="break-all">
                    <span className="break-all">{rating.review}</span>
                    <button
                      id="less-btn"
                      className={`m-1 font-semibold flex items-center gap-1`}
                      onClick={() => setExpandedReviewIndex(null)}
                    >
                      Less
                      <FaArrowUp />
                    </button>
                  </p>
                </div>
              </div>
            )}
            {/* full review */}
          </div>
        ))}
    </>
  );
};

RatingCard.propTypes = {
  packageRatings: PropTypes.arrayOf(
    PropTypes.shape({
      userProfileImg: PropTypes.string,
      username: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      review: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RatingCard;
