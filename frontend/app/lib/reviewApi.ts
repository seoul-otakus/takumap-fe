import type { Review } from "../types";

const STORAGE_PREFIX = "takumap_reviews_";
const USER_ID_KEY = "takumap_temp_user_id";

// localStorage에서 리뷰 데이터 가져오기
function getStorageKey(placeId: number): string {
  return `${STORAGE_PREFIX}${placeId}`;
}

// 임시 사용자 ID 생성 및 관리 (추후 로그인 시스템으로 대체)
export function getTempUserId(): string {
  if (typeof window === "undefined") return "temp_user_anonymous";

  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    // 새로운 임시 사용자 ID 생성
    userId = `temp_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

// 임시 사용자 닉네임 생성 (추후 실제 사용자 닉네임으로 대체)
export function getTempUserNickname(): string {
  const userId = getTempUserId();
  // "익명####" 형식의 닉네임 생성
  const randomNum = parseInt(userId.split("_").pop()?.substr(0, 4) || "0000", 36) % 10000;
  return `익명${randomNum.toString().padStart(4, "0")}`;
}

// 특정 장소의 모든 리뷰 조회
export async function getReviews(placeId: number): Promise<Review[]> {
  // 추후 API 호출로 변경 가능
  // const response = await fetch(`/api/reviews?placeId=${placeId}`);
  // return await response.json();

  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(getStorageKey(placeId));
    if (!data) return [];

    const reviews: Review[] = JSON.parse(data);
    // 최신순 정렬
    return reviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return [];
  }
}

// 새 리뷰 작성
export async function createReview(
  placeId: number,
  reviewData: Omit<Review, "id" | "placeId" | "createdAt">
): Promise<Review> {
  // 추후 API 호출로 변경 가능
  // const response = await fetch('/api/reviews', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ placeId, ...reviewData }),
  // });
  // return await response.json();

  const newReview: Review = {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    placeId,
    ...reviewData,
    createdAt: new Date().toISOString(),
  };

  const reviews = await getReviews(placeId);
  reviews.push(newReview);

  if (typeof window !== "undefined") {
    localStorage.setItem(getStorageKey(placeId), JSON.stringify(reviews));
  }

  return newReview;
}

// 리뷰 수정
export async function updateReview(
  reviewId: string,
  placeId: number,
  reviewData: Partial<Omit<Review, "id" | "placeId" | "createdAt">>
): Promise<Review> {
  // 추후 API 호출로 변경 가능
  // const response = await fetch(`/api/reviews/${reviewId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(reviewData),
  // });
  // return await response.json();

  const reviews = await getReviews(placeId);
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }

  const updatedReview: Review = {
    ...reviews[reviewIndex],
    ...reviewData,
    updatedAt: new Date().toISOString(),
  };

  reviews[reviewIndex] = updatedReview;

  if (typeof window !== "undefined") {
    localStorage.setItem(getStorageKey(placeId), JSON.stringify(reviews));
  }

  return updatedReview;
}

// 리뷰 삭제
export async function deleteReview(
  reviewId: string,
  placeId: number
): Promise<void> {
  // 추후 API 호출로 변경 가능
  // await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });

  const reviews = await getReviews(placeId);
  const filteredReviews = reviews.filter((r) => r.id !== reviewId);

  if (typeof window !== "undefined") {
    localStorage.setItem(getStorageKey(placeId), JSON.stringify(filteredReviews));
  }
}
