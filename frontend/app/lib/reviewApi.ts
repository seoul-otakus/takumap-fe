import api from "@/lib/api";
import type {
  ReviewDetailResponse,
  ReviewSingleResponse,
  ReviewCreateRequest,
  ReviewUpdateRequest,
  ApiResponse,
  PageResponse,
} from "../types";

/**
 * 특정 가게의 리뷰 목록 조회 (페이징)
 * @param shopId 가게 ID (백엔드에서는 shopId로 명명)
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기 (기본 10)
 */
export async function getReviews(
  shopId: number,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<ReviewSingleResponse>> {
  try {
    const response = await api.get<
      ApiResponse<PageResponse<ReviewSingleResponse>>
    >(`/api/v1/reviews`, {
      params: { shopId, page, size, sort: "createdAt,desc" },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to load reviews:", error);
    throw error;
  }
}

/**
 * 리뷰 상세 조회
 * @param reviewId 리뷰 ID
 */
export async function getReviewById(
  reviewId: number
): Promise<ReviewDetailResponse> {
  try {
    const response = await api.get<ApiResponse<ReviewDetailResponse>>(
      `/api/v1/reviews/${reviewId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to load review:", error);
    throw error;
  }
}

/**
 * 새 리뷰 작성
 * @param reviewData 리뷰 작성 데이터
 */
export async function createReview(
  reviewData: ReviewCreateRequest
): Promise<ReviewDetailResponse> {
  try {
    const response = await api.post<ApiResponse<ReviewDetailResponse>>(
      `/api/v1/reviews`,
      reviewData
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to create review:", error);
    throw error;
  }
}

/**
 * 리뷰 수정
 * @param reviewId 리뷰 ID
 * @param reviewData 수정할 리뷰 데이터
 */
export async function updateReview(
  reviewId: number,
  reviewData: ReviewUpdateRequest
): Promise<ReviewDetailResponse> {
  try {
    const response = await api.put<ApiResponse<ReviewDetailResponse>>(
      `/api/v1/reviews/${reviewId}`,
      reviewData
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update review:", error);
    throw error;
  }
}

/**
 * 리뷰 삭제
 * @param reviewId 리뷰 ID
 */
export async function deleteReview(reviewId: number): Promise<void> {
  try {
    await api.delete(`/api/v1/reviews/${reviewId}`);
  } catch (error) {
    console.error("Failed to delete review:", error);
    throw error;
  }
}
