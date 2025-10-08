"use client";

import { useState, useEffect, useRef } from "react";
import type { Place } from "../types/index";
import PlaceCard from "./PlaceCard";

interface PlaceListProps {
  places: Place[];
}

const PlaceList = ({ places }: PlaceListProps) => {
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // places가 변경되면 visibleCount 초기화 (검색 시)
  useEffect(() => {
    setVisibleCount(20);
  }, [places]);

  const visiblePlaces = places.slice(0, visibleCount);
  const hasMore = visibleCount < places.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          // 실제 API 호출처럼 약간의 딜레이 추가
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 20, places.length));
            setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, places.length]);

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {/* 무한스크롤 트리거 */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">로딩 중...</span>
            </div>
          )}
        </div>
      )}

      {/* 모든 항목 로드 완료 */}
      {!hasMore && places.length > 0 && (
        <div className="text-center py-8 text-gray-500 font-medium">
          모든 장소를 확인하셨습니다 ({places.length}개)
        </div>
      )}
    </div>
  );
};

export default PlaceList;
