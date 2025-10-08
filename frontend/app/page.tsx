"use client";

import { useState, useEffect, useMemo } from "react";
import type { ViewMode } from "./types/index";
import { places } from "./lib/places";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ViewTabs from "./components/ViewTabs";
import PlaceList from "./components/PlaceList";
import KakaoMap from "./components/KakaoMap";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  // 검색 및 카테고리 필터링
  const filteredPlaces = useMemo(() => {
    let result = places;

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
  }, [searchKeyword, selectedCategories]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
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
          />
        </div>

        <ViewTabs viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === "list" ? (
          <PlaceList places={filteredPlaces} key={`${searchKeyword}-${selectedCategories.join(",")}`} />
        ) : (
          <KakaoMap places={filteredPlaces} />
        )}
      </main>

      <Footer />
    </div>
  );
}
