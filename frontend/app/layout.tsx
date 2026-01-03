import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "./context/AuthContext"; // 1. AuthProvider import
import "./globals.css";

export const metadata: Metadata = {
  title: "타쿠맵 - 오타쿠를 위한 성지순례 지도",
  description:
    "전국의 모든 오타쿠 성지를 한눈에! 가챠샵, 굿즈샵, 피규어샵, 애니메이션 카페 등 오타쿠 문화 공간을 찾아보세요.",
  keywords: [
    "오타쿠",
    "타쿠맵",
    "성지순례",
    "가챠샵",
    "굿즈샵",
    "피규어샵",
    "애니메이션 카페",
  ],
  openGraph: {
    title: "타쿠맵 - 오타쿠를 위한 성지순례 지도",
    description: "전국의 모든 오타쿠 성지를 한눈에!",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      {/* 2. AuthProvider로 children 감싸기 */}
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
