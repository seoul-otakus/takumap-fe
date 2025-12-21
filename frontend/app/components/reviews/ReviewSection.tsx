"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import type { Review, ReviewSingleResponse } from "../../types";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../lib/reviewApi";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

interface ReviewSectionProps {
  placeId: number;
}

// ReviewSingleResponse를 Review 타입으로 변환
function convertToReview(apiReview: ReviewSingleResponse): Review {
  return {
    id: apiReview.id.toString(),
    placeId: apiReview.shopId,
    nickname: apiReview.writer.nickname,
    rating: apiReview.rating,
    content: apiReview.content,
    images: apiReview.images.map((img) => img.downloadUrl),
    createdAt: apiReview.createdAt,
  };
}

export default function ReviewSection({ placeId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const pageResponse = await getReviews(placeId);
      const convertedReviews = pageResponse.content.map(convertToReview);
      setReviews(convertedReviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [placeId]);

  // 리뷰 불러오기 및 사용자 인증 확인
  useEffect(() => {
    loadReviews();

    // TODO: 실제 인증 체크 로직으로 교체
    // 현재는 임시로 항상 인증되지 않은 것으로 처리
    setIsAuthenticated(false);
    setCurrentUserNickname("");
  }, [loadReviews]);

  const handleCreate = async (reviewData: {
    nickname: string;
    rating: number;
    content: string;
    images: string[];
  }) => {
    try {
      // TODO: 실제 이미지 업로드 후 objectKeys를 받아야 함
      await createReview({
        shopId: placeId,
        rating: reviewData.rating,
        content: reviewData.content,
        // objectKeys: [], // 이미지 업로드 후 추가
      });

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
      // TODO: 실제 이미지 업로드 후 objectKeys를 받아야 함
      await updateReview(Number(reviewId), {
        rating: reviewData.rating,
        content: reviewData.content,
        // objectKeys: [], // 이미지 업로드 후 추가
      });
      await loadReviews();
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("리뷰 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(Number(reviewId));
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
      {isAuthenticated && currentUserNickname && (
        <div id="review-form">
          <ReviewForm
            currentNickname={currentUserNickname}
            editingReview={null}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {/* 로그인 안내 메시지 */}
      {!isAuthenticated && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
          <p className="text-gray-600">
            리뷰를 작성하려면 로그인이 필요합니다.
          </p>
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
            <p className="text-gray-500 font-medium">아직 리뷰가 없습니다.</p>
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
