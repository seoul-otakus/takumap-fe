"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import type { Review } from "../../types";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getTempUserNickname,
} from "../../lib/reviewApi";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

interface ReviewSectionProps {
  placeId: number;
}

export default function ReviewSection({ placeId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getReviews(placeId);
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [placeId]);

  // 리뷰 불러오기 및 임시 닉네임 생성
  useEffect(() => {
    loadReviews();
    // 임시 닉네임 생성 (추후 로그인 시스템에서 실제 닉네임으로 대체)
    setCurrentUserNickname(getTempUserNickname());
  }, [loadReviews]);

  const handleCreate = async (reviewData: {
    nickname: string;
    rating: number;
    content: string;
    images: string[];
  }) => {
    try {
      // 새 리뷰 작성
      await createReview(placeId, reviewData);
      setCurrentUserNickname(reviewData.nickname);

      // 리뷰 목록 새로고침
      await loadReviews();
    } catch (error) {
      console.error("Failed to create review:", error);
      alert("리뷰 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleUpdate = async (
    reviewId: string,
    reviewData: { rating: number; content: string; images: string[] }
  ) => {
    try {
      await updateReview(reviewId, placeId, reviewData);
      await loadReviews();
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("리뷰 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(reviewId, placeId);
      await loadReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={28} className="text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">
          리뷰 ({reviews.length})
        </h2>
      </div>

      {/* 리뷰 작성 폼 */}
      {currentUserNickname && (
        <div id="review-form">
          <ReviewForm
            currentNickname={currentUserNickname}
            editingReview={null}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {/* 리뷰 목록 */}
      <div>
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            리뷰를 불러오는 중...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              아직 리뷰가 없습니다.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              첫 번째 리뷰를 작성해보세요!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="px-6">
                <ReviewItem
                  review={review}
                  currentUserNickname={currentUserNickname}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
