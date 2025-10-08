import { MapPin, Star, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Place } from "../types/index";
import KakaoIcon from "./icons/KakaoIcon";

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const getCategoryStyle = (category: string) => {
    const styles: { [key: string]: string } = {
      가챠샵: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
      굿즈샵: "bg-gradient-to-r from-sky-500 to-blue-500 text-white",
      피규어샵: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
      "애니메이션 카페":
        "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
      "코스프레 의상점":
        "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
      만화책방: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      성지순례지: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    };
    return (
      styles[category] ||
      "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
    );
  };

  return (
    <Link href={`/place/${place.id}`}>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 cursor-pointer">
        {/* 상단 장식 라인 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

        {/* 대표 이미지 */}
        {place.mainImage ? (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={place.mainImage}
              alt={place.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ImageIcon size={64} className="text-gray-400" />
          </div>
        )}

        <div className="p-6">
        {/* 헤더 */}
        <div className="mb-4">
          <div className="flex-1 min-h-[60px]">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {place.name}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getCategoryStyle(
                place.category
              )}`}
            >
              <Star size={12} fill="currentColor" />
              {place.category}
            </span>
          </div>
        </div>

        {/* 주소 */}
        <div className="flex items-start gap-2.5 mb-4 p-3 bg-gray-50 rounded-lg">
          <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary" />
          <p className="text-sm text-gray-700 font-medium">{place.address}</p>
        </div>

        {/* 해시태그 */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
          {place.hashtags && place.hashtags.length > 0 && (
            <>
              {place.hashtags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="text-sm text-primary font-semibold hover:text-secondary transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </>
          )}
        </div>

        {/* 설명 */}
        <div className="mb-5 min-h-[40px]">
          {place.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(
                place.naverMapUrl,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#03C75A] hover:bg-[#02B350] text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <span className="text-lg">N</span>
            <span>네이버</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(
                place.kakaoMapUrl,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <KakaoIcon size={18} />
            <span>카카오</span>
          </button>
        </div>
      </div>

        {/* 호버 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default PlaceCard;
