import api from "@/lib/api";
import type { ApiResponse, PageResponse, UserListItem } from "../types";

/**
 * 모든 사용자 목록 조회 (관리자 전용, 페이징 처리)
 * @param page 페이지 번호 (0-indexed)
 * @param size 페이지 크기 (기본값 20)
 */
export async function getAllUsers(
  page: number = 0,
  size: number = 20
): Promise<PageResponse<UserListItem>> {
  try {
    const response = await api.get<ApiResponse<PageResponse<UserListItem>>>(
      '/api/v1/admin/users',
      {
        params: { page, size, sort: 'createdAt,desc' }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to load users:', error);
    throw error;
  }
}

/**
 * 사용자 및 해당 사용자의 모든 리뷰 삭제 (관리자 전용, Hard Delete)
 * @param userId 삭제할 사용자 ID
 */
export async function deleteUser(userId: number): Promise<void> {
  try {
    await api.delete(`/api/v1/admin/users/${userId}`);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}
