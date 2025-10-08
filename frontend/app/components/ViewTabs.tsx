"use client";

import { List, Map } from "lucide-react";
import type { ViewMode } from "../types/index";

interface ViewTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewTabs = ({ viewMode, onViewModeChange }: ViewTabsProps) => {
  return (
    <div className="flex justify-center mb-8 px-4">
      <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-xl border border-gray-200">
        <button
          onClick={() => onViewModeChange("list")}
          className={`relative flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
            viewMode === "list"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <List
            size={22}
            className={viewMode === "list" ? "animate-pulse" : ""}
          />
          <span className="text-sm md:text-base">리스트 뷰</span>
        </button>
        <button
          onClick={() => onViewModeChange("map")}
          className={`relative flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
            viewMode === "map"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Map
            size={22}
            className={viewMode === "map" ? "animate-pulse" : ""}
          />
          <span className="text-sm md:text-base">지도 뷰</span>
        </button>
      </div>
    </div>
  );
};

export default ViewTabs;
