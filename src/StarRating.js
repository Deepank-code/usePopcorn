import { useState } from "react";

const Star = ({ onRating, isFull, onMouseIn, onMouseOut, color, size }) => {
  return (
    <>
      <span
        onClick={onRating}
        onMouseEnter={onMouseIn}
        onMouseLeave={onMouseOut}
      >
        {isFull ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={color}
            stroke={color}
            width={`${size}px`}
            height={`${size}px`}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke={color}
            width={`${size}px`}
            height={`${size}px`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        )}
      </span>
    </>
  );
};

const StarRating = ({
  maxLength = 5,
  color = "#fcc419",
  size = 49,
  onsetRating,
}) => {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  function handleRating(rating) {
    setRating(rating);
    onsetRating(rating);
  }
  return (
    <div className="star-rating-div">
      {Array.from({ length: maxLength }, (_, index) => {
        return (
          <Star
            size={size}
            color={color}
            onRating={() => handleRating(index + 1)}
            onMouseIn={() => setTempRating(index + 1)}
            onMouseOut={() => setTempRating(0)}
            isFull={tempRating ? tempRating >= index + 1 : rating >= index + 1}
          />
        );
      })}
      {rating}
    </div>
  );
};

export default StarRating;
