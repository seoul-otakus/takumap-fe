// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "media.discordapp.net",
      },
    ],
  },
  
  // 🔥 프록시 설정을 위한 rewrites 비동기 함수 추가
  async rewrites() {
    return [
      {
        // 1. 프론트엔드에서 API 요청을 보낼 경로
        // 예: http://localhost:3000/api/v1/auth/check
        source: '/api/v1/:path*',
        
        // 2. 실제 백엔드 서버 주소 (8080 포트)
        // source의 나머지 경로(path*)를 destination에 붙여서 보냅니다.
        // 예: http://localhost:8080/api/v1/auth/check
        destination: 'https://api.ourhour.cloud/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;