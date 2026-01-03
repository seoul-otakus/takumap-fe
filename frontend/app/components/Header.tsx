'use client'; 

import { MapPin, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // 1. useAuth 훅 import

const Header = () => {
    // 2. AuthContext에서 상태와 함수들을 가져옴
    const { isLoggedIn, user: currentUser, isLoading, logout: handleLogout } = useAuth();

    // 3. 내부 상태관리 로직 (useState, useEffect, handleLogout) 모두 제거
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
                <div className="mt-6 flex flex-col items-center justify-center gap-3">
                    {/* 4. 로딩 중일 때는 아무것도 표시하지 않거나 로딩 스피너를 표시 */}
                    {isLoading ? null : isLoggedIn ? (
                        <>
                            {/* 환영 메시지 */}
                            {currentUser && ( 
                                <div className="text-white font-semibold"> 
                                    {currentUser.nickname}님 환영합니다!
                                </div>
                            )}
                            
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

                            {/* 로그아웃 버튼 (컨텍스트의 handleLogout 사용) */}
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