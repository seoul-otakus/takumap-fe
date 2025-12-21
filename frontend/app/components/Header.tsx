'use client'; // 이 지시자는 Next.js 환경에서 필수입니다.

import { MapPin, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { User } from "../types";
import { getCurrentUser } from "../lib/authApi";

const Header = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    // const BACKEND_URL = "http://localhost:8080/api/v1";
    
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // 현재 사용자 정보 조회 (role 포함)
                const user = await getCurrentUser();
                setCurrentUser(user);
                setIsLoggedIn(true);
            } catch (error) {
                // 인증 실패 시
                setCurrentUser(null);
                setIsLoggedIn(false);
                console.error("인증 상태 확인 실패:", error);
            }
        };

        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
            verifyAuth();
        }
    }, []);

    // 2. 로그아웃 핸들러 (서버에서 쿠키를 만료시키는 방식)
    const handleLogout = async () => {
        const logoutUrl: string = `/api/v1/auth/logout`;

        try {
            // api.post()는 자동으로 withCredentials를 처리.
            const response = await api.post(logoutUrl);

            if (response.status === 200) {
                // 서버가 응답 헤더에 쿠키 만료 지시 (Set-Cookie: Max-Age=0)를 담아 보냈으므로,
                // 프론트는 별도의 쿠키 제거 로직이 필요 없습니다.
                setIsLoggedIn(false); 
                console.log("로그아웃 성공 및 상태 변경");

                window.location.href = '/'; 
                
            } else {
                console.error('로그아웃 실패:', response.status);
                alert('로그아웃 처리에 실패했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('네트워크 오류로 로그아웃 요청 실패:', error);
            alert('서버와의 연결에 문제가 발생했습니다. 네트워크 상태를 확인해 주세요.');
        }
    };

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

                {/* 🔥 로그인/로그아웃 및 관리자 버튼 조건부 렌더링 영역 */}
                <div className="mt-6 flex justify-center gap-3">
                    {isLoggedIn ? (
                        <>
                            {/* 관리자 버튼 - ROLE_ADMIN일 때만 표시 */}
                            {currentUser?.role === 'ROLE_ADMIN' && (
                                <Link
                                    href="/admin/users"
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    관리자
                                </Link>
                            )}

                            {/* 로그아웃 버튼 */}
                            <button
                                onClick={handleLogout}
                                className="bg-white text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        // 🔴 로그아웃 상태일 때: 로그인/회원가입 버튼 표시
                        <Link
                            href="/login"
                            className="bg-white text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
                        >
                            로그인 / 회원가입
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;