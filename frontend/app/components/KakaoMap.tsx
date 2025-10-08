"use client";

import { useEffect, useRef } from "react";
import type { Place } from "../types/index";

interface KakaoMapProps {
  places: Place[];
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = ({ places }: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const currentInfowindowRef = useRef<any>(null);

  useEffect(() => {
    // 이미 지도가 초기화되어 있으면 리턴
    if (mapInstance.current) return;

    const initMap = () => {
      if (!mapContainer.current || mapInstance.current) return;

      window.kakao.maps.load(() => {
        const container = mapContainer.current;
        if (!container || mapInstance.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울시청 기준
          level: 8,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        // 지도 클릭 시 인포윈도우 닫기
        window.kakao.maps.event.addListener(map, "click", () => {
          if (currentInfowindowRef.current) {
            currentInfowindowRef.current.close();
            currentInfowindowRef.current = null;
          }
        });

        // 초기 마커 생성
        createMarkers(map);
      });
    };

    if (!mapContainer.current) return;

    // Kakao Maps API가 로드될 때까지 대기
    const checkKakaoLoaded = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        clearInterval(checkKakaoLoaded);
        initMap();
      }
    }, 100);

    return () => clearInterval(checkKakaoLoaded);
  }, []);

  const createMarkers = (map: any) => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 생성
    places.forEach((place) => {
      const markerPosition = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: place.name,
      });

      marker.setMap(map);
      markersRef.current.push(marker);

      // 인포윈도우 내용
      const infowindowContent = `
        <div style="padding: 15px; min-width: 200px;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">
            ${place.name}
          </div>
          <div style="display: inline-block; padding: 4px 8px; background-color: #FF6B9D; color: white; border-radius: 12px; font-size: 12px; margin-bottom: 8px;">
            ${place.category}
          </div>
          <div style="font-size: 13px; color: #666; margin-top: 8px;">
            ${place.address}
          </div>
        </div>
      `;

      const infowindow = new window.kakao.maps.InfoWindow({
        content: infowindowContent,
      });

      // 마커 클릭 이벤트 (토글 기능)
      window.kakao.maps.event.addListener(marker, "click", () => {
        // 같은 인포윈도우를 다시 클릭하면 닫기
        if (currentInfowindowRef.current === infowindow) {
          infowindow.close();
          currentInfowindowRef.current = null;
        } else {
          // 다른 인포윈도우가 열려있으면 닫기
          if (currentInfowindowRef.current) {
            currentInfowindowRef.current.close();
          }
          // 새 인포윈도우 열기
          infowindow.open(map, marker);
          currentInfowindowRef.current = infowindow;
        }
      });
    });
  };

  // places가 변경될 때 마커 업데이트
  useEffect(() => {
    if (mapInstance.current) {
      createMarkers(mapInstance.current);
    }
  }, [places]);

  return (
    <div className="px-4 md:px-8 py-6">
      <div
        ref={mapContainer}
        className="w-full h-[70vh] rounded-xl shadow-lg"
        style={{ position: "relative" }}
      />
    </div>
  );
};

export default KakaoMap;
