export interface Place {
  id: number;
  name: string;
  category: string;
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  naverMapUrl: string; // 네이버 지도 링크
  kakaoMapUrl: string; // 카카오맵 링크
  mainImage?: string; // 대표 이미지 URL
  images?: string[]; // 추가 이미지 URLs
  hashtags?: string[]; // 해시태그
  phone?: string; // 전화번호
  hours?: string; // 운영시간
  isFavorited?: boolean; // 즐겨찾기 여부
}

export type ViewMode = "list" | "map";

// 백엔드 API 응답 타입
export interface ReviewDetailResponse {
  id: number;
  writer: {
    id: number;
    nickname: string;
  };
  shop: {
    id: number;
    name: string;
  };
  rating: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  images: {
    objectKey: string;
    downloadUrl: string;
  }[];
}

export interface ReviewSingleResponse {
  id: number;
  writer: {
    id: number;
    nickname: string;
  };
  shopId: number;
  rating: number;
  content: string;
  createdAt: string;
  images: {
    objectKey: string;
    downloadUrl: string;
  }[];
}

// 백엔드 API 요청 타입
export interface ReviewCreateRequest {
  shopId: number;
  rating: number; // 0.5 ~ 5.0
  content?: string;
  objectKeys?: string[]; // S3에 업로드된 이미지 objectKey 목록
}

export interface ReviewUpdateRequest {
  rating?: number;
  content?: string;
  objectKeys?: string[];
}

// 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
  errorCode?: number;
}

// 로컬에서 사용하는 Review 타입 (기존 호환성 유지)
export interface Review {
  id: string;
  placeId: number;
  nickname: string;
  rating: number; // 1-5
  content: string;
  images: string[]; // base64 encoded images
  createdAt: string; // ISO 8601 date string
  updatedAt?: string; // ISO 8601 date string
}

// User 관련 타입
export interface User {
  id: number;
  nickname: string;
  userId: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface UserListItem {
  id: number;
  nickname: string;
  userId: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  provider: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserListResponse {
  content: UserListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
