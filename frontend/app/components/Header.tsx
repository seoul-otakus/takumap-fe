import { MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="relative bg-gradient-to-br from-primary via-secondary to-accent text-white py-12 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <MapPin className="w-8 h-8" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            TAKUMAP
          </h1>
        </div>
        <p className="text-xl md:text-2xl font-medium tracking-wide">
          오타쿠를 위한 성지순례 지도
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          <span>서울의 모든 오타쿠 성지를 한눈에</span>
        </div>

        {/* 🔥 로그인 버튼 추가 영역 */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/login"
            className="bg-white text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            로그인 / 회원가입
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;
