import api from "@/lib/api";
import type { ApiResponse } from "../types";

/**
 * 즐겨찾기 토글 (추가/해제)
 * @param shopId 가게 ID
 * @returns 즐겨찾기 추가 여부 (true: 추가됨, false: 해제됨)
 */
export async function toggleFavorite(shopId: number): Promise<boolean> {
  const response = await api.post<ApiResponse<boolean>>(
    `/api/v1/favorites/${shopId}/toggle`
  );
  return response.data.data;
}

/**
 * 현재 사용자의 즐겨찾기된 가게 ID 목록 조회
 * @returns 즐겨찾기된 가게 ID 배열
 */
export async function getFavoriteShopIds(): Promise<number[]> {
  const response = await api.get<ApiResponse<number[]>>(
    `/api/v1/favorites/shop-ids`
  );
  return response.data.data;
}
