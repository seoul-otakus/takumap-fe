"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  Image as ImageIcon,
  Phone,
  Clock,
  Share2,
} from "lucide-react";
import type { Place } from "../../types/index";
import { places } from "../../lib/places";
import KakaoIcon from "../../components/icons/KakaoIcon";

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    const foundPlace = places.find((p) => p.id === id);
    if (foundPlace) {
      setPlace(foundPlace);
    }
  }, [params.id]);

  useEffect(() => {
    if (!place) return;

    // 카카오맵 초기화
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps) return;

      window.kakao.maps.load(() => {
        const container = document.getElementById("detail-map");
        if (!container) return;

        const options = {
          center: new window.kakao.maps.LatLng(
            place.latitude,
            place.longitude
          ),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          place.latitude,
          place.longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        setMapLoaded(true);
      });
    };

    // 카카오맵 API 로드 대기
    const checkKakaoLoaded = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        clearInterval(checkKakaoLoaded);
        initMap();
      }
    }, 100);

    return () => clearInterval(checkKakaoLoaded);
  }, [place]);

  const handleShare = async () => {
    if (navigator.share && place) {
      try {
        await navigator.share({
          title: place.name,
          text: place.description || place.name,
          url: window.location.href,
        });
      } catch (error) {
        console.log("공유 실패:", error);
      }
    } else {
      // 공유 API 미지원 시 URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            장소를 찾을 수 없습니다
          </h2>
          <Link
            href="/"
            className="text-primary hover:text-secondary underline font-medium"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const allImages = place.mainImage
    ? [place.mainImage, ...(place.images || [])]
    : place.images || [];

  const getCategoryStyle = (category: string) => {
    const styles: { [key: string]: string } = {
      가챠샵: "from-pink-500 to-rose-500",
      굿즈샵: "from-sky-500 to-blue-500",
      피규어샵: "from-purple-500 to-indigo-500",
      "애니메이션 카페": "from-amber-500 to-orange-500",
      "코스프레 의상점": "from-emerald-500 to-green-500",
      만화책방: "from-orange-500 to-red-500",
      성지순례지: "from-red-500 to-pink-500",
    };
    return styles[category] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">뒤로 가기</span>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 상단: 제목 & 카테고리 & 해시태그 */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              {place.name}
            </h1>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getCategoryStyle(
                place.category
              )} text-white`}
            >
              <Star size={16} fill="currentColor" />
              {place.category}
            </span>
          </div>

          {/* 해시태그 */}
          {place.hashtags && place.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {place.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 이미지 갤러리 (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 이미지 갤러리 */}
            {allImages.length > 0 ? (
              <div className="space-y-4">
                {/* 메인 이미지 */}
                <div className="relative w-full aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src={allImages[selectedImageIndex]}
                    alt={`${place.name} - ${selectedImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* 썸네일 리스트 */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {allImages.slice(0, 5).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-primary"
                            : "border-gray-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${place.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full aspect-[16/10] bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <ImageIcon size={80} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">이미지 준비중</p>
                </div>
              </div>
            )}

            {/* 설명 */}
            {place.description && (
              <div className="py-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">소개</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {place.description}
                </p>
              </div>
            )}

            {/* 위치 섹션 */}
            <div className="border-t border-gray-200 pt-8 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin size={24} className="text-primary" />
                  위치
                </h2>
                <p className="text-gray-600 ml-8">{place.address}</p>
              </div>

              {/* 지도 */}
              <div
                id="detail-map"
                className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200"
                style={{ position: "relative" }}
              />

              {/* 지도에서 보기 버튼들 */}
              <div className="flex gap-3">
                <a
                  href={place.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02B350] text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  <span className="text-lg">N</span>
                  <span>네이버 지도</span>
                </a>
                <a
                  href={place.kakaoMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  <KakaoIcon size={20} />
                  <span>카카오맵</span>
                </a>
              </div>
            </div>
          </div>

          {/* 오른쪽: 정보 (1/3) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* 전화번호 */}
              {place.phone && (
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                  <Phone size={20} className="mt-0.5 text-primary" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">
                      전화번호
                    </h4>
                    <a
                      href={`tel:${place.phone}`}
                      className="text-gray-900 font-medium hover:text-primary transition-colors"
                    >
                      {place.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* 운영시간 */}
              {place.hours && (
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                  <Clock size={20} className="mt-0.5 text-primary" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">
                      운영시간
                    </h4>
                    <p className="text-gray-900 font-medium whitespace-pre-line">
                      {place.hours}
                    </p>
                  </div>
                </div>
              )}

              {/* 공유 버튼 */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-4 rounded-xl font-bold transition-colors"
              >
                <Share2 size={20} />
                <span>공유하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
