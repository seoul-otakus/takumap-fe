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
}

export type ViewMode = "list" | "map";

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
