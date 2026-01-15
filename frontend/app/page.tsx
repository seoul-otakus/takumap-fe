"use client";

import { useState, useEffect, useMemo } from "react";
import type { ViewMode, Place } from "./types/index";
import { places as staticPlaces } from "./lib/places";
import { useAuth } from "./context/AuthContext"; // 1. useAuth import
import { getFavoriteShopIds } from "./lib/favoriteApi";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ViewTabs from "./components/ViewTabs";
import PlaceList from "./components/PlaceList";
import KakaoMap from "./components/KakaoMap";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";

export default function Home() {
  const { isLoggedIn } = useAuth(); // 2. useAuth에서 로그인 상태 가져오기
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // 3. 내부 isLoggedIn 상태 제거
  const [favoriteShopIds, setFavoriteShopIds] = useState<Set<number>>(new Set());
  const [places, setPlaces] = useState<Place[]>([]);

  // 4. 로그인 상태(isLoggedIn)에 따라 즐겨찾기 목록을 다시 불러오도록 useEffect 수정
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isLoggedIn) {
        try {
          const ids = await getFavoriteShopIds();
          setFavoriteShopIds(new Set(ids));
        } catch (error) {
          console.error("즐겨찾기 목록 조회 실패:", error);
          setFavoriteShopIds(new Set()); // 에러 발생 시 초기화
        }
      } else {
        // 로그아웃 상태이면 즐겨찾기 목록 초기화
        setFavoriteShopIds(new Set());
      }
    };
    fetchFavorites();
  }, [isLoggedIn]); // isLoggedIn이 변경될 때마다 실행

  // 정적 데이터에 즐겨찾기 상태 매핑
  useEffect(() => {
    const placesWithFavorites = staticPlaces.map(place => ({
      ...place,
      isFavorited: favoriteShopIds.has(place.id)
    }));
    setPlaces(placesWithFavorites);
  }, [favoriteShopIds]);

  // 컴포넌트 마운트 시 세션 스토리지에서 불러오기
  useEffect(() => {
    const savedViewMode = sessionStorage.getItem("viewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode as ViewMode);
    }
  }, []);

  // viewMode가 변경될 때마다 세션 스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // 검색, 카테고리, 즐겨찾기 필터링
  const filteredPlaces = useMemo(() => {
    let result = places;

    // 즐겨찾기 필터
    if (showFavoritesOnly) {
      result = result.filter((place) => place.isFavorited);
    }

    // 카테고리 필터링
    if (selectedCategories.length > 0) {
      result = result.filter((place) =>
        selectedCategories.includes(place.category)
      );
    }

    // 검색 필터링
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      result = result.filter((place) => {
        const nameMatch = place.name.toLowerCase().includes(keyword);
        const addressMatch = place.address.toLowerCase().includes(keyword);
        return nameMatch || addressMatch;
      });
    }

    return result;
  }, [places, searchKeyword, selectedCategories, showFavoritesOnly]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleFavoritesToggle = (show: boolean) => {
    setShowFavoritesOnly(show);
  };

  const handleFavoriteChange = (placeId: number, isFavorited: boolean) => {
    setFavoriteShopIds(prev => {
      const newSet = new Set(prev);
      if (isFavorited) {
        newSet.add(placeId);
      } else {
        newSet.delete(placeId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/40 relative">
      {/* 배경 장식 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 relative z-10">
        {/* 검색바 */}
        <div className="px-4 md:px-8 mb-6">
          <SearchBar onSearch={handleSearch} />
          {searchKeyword && (
            <div className="mt-3 text-center text-sm text-gray-600">
              <span className="font-semibold text-primary">{filteredPlaces.length}개</span>의 장소를 찾았습니다
            </div>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="px-4 md:px-8 mb-6">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={handleFavoritesToggle}
            isLoggedIn={isLoggedIn}
          />
        </div>

        <ViewTabs viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === "list" ? (
          <PlaceList
            places={filteredPlaces}
            isLoggedIn={isLoggedIn}
            onFavoriteChange={handleFavoriteChange}
            key={`${searchKeyword}-${selectedCategories.join(",")}-${showFavoritesOnly}`}
          />
        ) : (
          <KakaoMap places={filteredPlaces} />
        )}
      </main>

      <Footer />
    </div>
  );
}
