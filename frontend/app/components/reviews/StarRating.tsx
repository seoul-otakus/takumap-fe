"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0-5
  editable?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({
  rating,
  editable = false,
  onChange,
  size = 20,
}: StarRatingProps) {
  const handleClick = (newRating: number) => {
    if (editable && onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={!editable}
          className={`transition-all ${
            editable
              ? "cursor-pointer hover:scale-110"
              : "cursor-default"
          }`}
        >
          <Star
            size={size}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
