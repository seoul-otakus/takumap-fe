"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import type {
  Review,
  ReviewSingleResponse,
  ReviewCreateRequest,
  ReviewUpdateRequest,
} from "../../types";
import * as reviewApi from "../../lib/reviewApi";
import * as fileApi from "../../lib/fileApi";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

// ReviewSingleResponse를 Review 타입으로 변환
function convertToLegacyReview(response: ReviewSingleResponse): Review {
  return {
    id: String(response.id),
    placeId: response.shopId,
    nickname: response.writer.nickname,
    rating: response.rating,
    content: response.content,
    images: response.images.map((img) => img.downloadUrl),
    createdAt: response.createdAt,
  };
}

interface ReviewSectionProps {
  placeId: number;
}

export default function ReviewSection({ placeId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      // 백엔드 API 호출 (페이징 지원)
      const pageResponse = await reviewApi.getReviews(placeId, currentPage, 10);

      // ReviewSingleResponse[]를 Review[]로 변환
      const legacyReviews = pageResponse.content.map(convertToLegacyReview);
      setReviews(legacyReviews);
      setTotalPages(pageResponse.totalPages);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [placeId, currentPage]);

  // 리뷰 불러오기
  useEffect(() => {
    loadReviews();

    // TODO: 실제 사용자 인증 확인으로 교체
    setIsAuthenticated(false);
    setCurrentUserNickname(""); // 로그인 전에는 빈 문자열
  }, [loadReviews]);

  const handleCreate = async (reviewData: {
    nickname: string;
    rating: number;
    content: string;
    images: string[];
  }) => {
    try {
      // TODO: 로그인 기능 구현 후 아래 주석 해제
      /*
      // 1. base64 이미지를 File로 변환
      const imageFiles = reviewData.images.map((base64, index) =>
        fileApi.base64ToFile(base64, `review-image-${index}.jpg`)
      );

      // 2. S3에 업로드
      const objectKeys = await fileApi.uploadFiles(imageFiles);

      // 3. 리뷰 생성 요청
      const createRequest: ReviewCreateRequest = {
        shopId: placeId,
        rating: reviewData.rating,
        content: reviewData.content,
        objectKeys: objectKeys,
      };

      await reviewApi.createReview(createRequest);
      await loadReviews();
      */

      // 임시: 로그인 필요 알림
      alert("리뷰 작성 기능은 로그인 후 사용 가능합니다.");
    } catch (error: unknown) {
      console.error("Failed to create review:", error);
      const errorMessage =
        error instanceof Error ? error.message : "리뷰 작성에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleUpdate = async (
    reviewId: string,
    reviewData: { rating: number; content: string; images: string[] }
  ) => {
    try {
      // TODO: 로그인 기능 구현 후 아래 주석 해제
      /*
      // 1. 새로운 base64 이미지를 File로 변환 및 S3 업로드
      const newImageFiles = reviewData.images
        .filter((img) => img.startsWith("data:"))
        .map((base64, index) =>
          fileApi.base64ToFile(base64, `review-image-${index}.jpg`)
        );
      
      const newObjectKeys = newImageFiles.length > 0 
        ? await fileApi.uploadFiles(newImageFiles) 
        : [];

      // 2. 기존 URL 이미지에서 objectKey 추출 (이미 업로드된 이미지)
      const existingKeys = reviewData.images
        .filter((img) => !img.startsWith("data:"))
        .map((url) => {
          const match = url.match(/\/([^\/]+)$/);
          return match ? match[1] : url;
        });

      // 3. 리뷰 수정 요청
      const updateRequest: ReviewUpdateRequest = {
        rating: reviewData.rating,
        content: reviewData.content,
        objectKeys: [...existingKeys, ...newObjectKeys],
      };

      await reviewApi.updateReview(Number(reviewId), updateRequest);
      await loadReviews();
      */

      // 임시: 로그인 필요 알림
      alert("리뷰 수정 기능은 로그인 후 사용 가능합니다.");
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("리뷰 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      // TODO: 로그인 기능 구현 후 아래 주석 해제
      /*
      await reviewApi.deleteReview(Number(reviewId));
      await loadReviews();
      */

      // 임시: 로그인 필요 알림
      alert("리뷰 삭제 기능은 로그인 후 사용 가능합니다.");
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

      {/* 로그인 안내 메시지 */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            💡 리뷰를 작성하려면{" "}
            <a href="/login" className="font-bold underline">
              로그인
            </a>
            이 필요합니다.
          </p>
        </div>
      )}

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

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            <span className="px-4 py-2">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
