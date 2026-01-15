'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk, SiNaver } from "react-icons/si";
import { useAuth } from '../context/AuthContext'; // 1. useAuth import
import { User } from '../types'; // User 타입 import

// const BACKEND_URL = "http://localhost:8080";
const BACKEND_URL = "https://api.ourhour.cloud";
const BASE_AUTH_URL : string = `${BACKEND_URL}/api/v1`;
const getButtonStyle = (base: string, bgColor: string, hoverColor: string) => 
    `${base} ${bgColor} ${hoverColor} w-full flex items-center justify-center gap-3 text-lg py-2 px-4 rounded-lg font-semibold transition duration-150 ease-in-out`;

const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out";
const labelStyle = "block text-sm font-medium text-gray-700";


export default function LoginPage() {
    const router = useRouter(); 
    const { login } = useAuth(); // 2. AuthContext에서 login 함수 가져오기
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    // 1. 소셜 로그인 핸들러 (OAuth2 시작)
    const handleSocialLogin = (provider: string) => {
        // BE: .authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/oauth2")) 설정에 따라
        // 모든 Provider가 /api/v1/oauth2/{provider} 경로로 요청하도록 통일
        const oauthStartUrl: string = `${BASE_AUTH_URL}/oauth2/${provider}`; 

        // 최종적으로 결정된 URL로 이동
        window.location.href = oauthStartUrl;
    };

    // 2. 자체 로그인 핸들러 (폼 제출)
    const handleFormLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const LOGIN_PROCESSING_URL: string = `${BASE_AUTH_URL}/sign-in`; 

        try {
            const response = await fetch(LOGIN_PROCESSING_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId, 
                    password: password, 
                }),
                credentials: 'include',
            });

            const result = await response.json();

            // 3. 응답 성공 시 전역 상태 업데이트 및 리디렉션
            if (response.ok) {
                // 백엔드 응답의 data 필드에 User 객체가 있다고 가정
                const user: User = result.data; 
                login(user); // 전역 상태 업데이트
                router.push('/'); // 메인 페이지로 이동
            } else if (response.status === 401) {
                alert('아이디와 비밀번호를 확인해주세요.');
            } else {
                alert(result.message || '로그인 실패');
            }
            
        } catch (error) {
            console.error('로그인 처리 중 오류 발생:', error);
            alert('서버 연결에 실패했습니다.');
        }
    };

    // // 3. 회원가입 페이지 이동 핸들러 (임시)
    const handleSignupNavigation = () => {
        router.push('/signup');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
                <h1 className="text-3xl font-bold mb-6">로그인</h1>
                <p className="text-gray-600 mb-4">소셜 계정으로 로그인하세요</p>
                
                {/* 1. 자체 로그인 폼 */}
                <form onSubmit={handleFormLogin} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label htmlFor="userId" className={labelStyle}>아이디</label>
                        <input
                            id="userId"
                            type="text"
                            placeholder="아이디를 입력하세요"
                            required
                            className={inputStyle}
                            value={userId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 text-left">
                        <label htmlFor="password" className={labelStyle}>비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            required
                            className={inputStyle}
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={getButtonStyle("text-white", "bg-blue-600", "hover:bg-blue-700")}>
                        로그인
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleSignupNavigation} 
                        className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150 mt-2"
                    >
                        아직 계정이 없으신가요? &nbsp; 회원가입
                    </button>
                </form>

                <div className="flex items-center space-x-2 my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-gray-500 text-sm">또는 소셜 로그인</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
               
                {/* 2. 소셜 로그인 버튼 */}
                <div className="space-y-4">
                    <button
                        className={getButtonStyle("text-black", "bg-[#E9E9E9]", "hover:bg-[#D3D3D3]")}
                        onClick={() => handleSocialLogin('google')}
                    >
                        <FcGoogle className="w-6 h-6" />
                        Google로 로그인
                    </button>

                    <button
                        className={getButtonStyle("text-black", "bg-[#FEE500]", "hover:bg-[#FDD835]")}
                        onClick={() => handleSocialLogin('kakao')}
                    >
                        <SiKakaotalk className="w-6 h-6" />
                        Kakao로 로그인
                    </button>

                    <button
                        className={getButtonStyle("text-white", "bg-[#03C75A]", "hover:bg-[#02B14F]")}
                        onClick={() => handleSocialLogin('naver')}
                    >
                        <SiNaver className="w-6 h-6" />
                        Naver로 로그인
                    </button>
                </div>
            </div>
        </div>
    );
}