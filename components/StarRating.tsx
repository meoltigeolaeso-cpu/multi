import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface StarRatingProps {
  count?: number;
  initialRating?: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  initialRating = 0,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    onRatingChange(rate);
  };

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
          aria-label={`Rate ${star} out of ${count}`}
        >
          <StarIcon
            className={`w-8 h-8 transition-colors duration-200 cursor-pointer ${
              (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
