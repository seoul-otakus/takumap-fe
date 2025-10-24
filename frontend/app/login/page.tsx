// 'use client';
// import { Button } from "@/components/ui/button";
// import { FcGoogle } from "react-icons/fc";
// import { SiKakaotalk, SiNaver } from "react-icons/si";

// const BACKEND_URL = "http://localhost:8080"; // 여기에 실제 백엔드 주소 입력

// export default function LoginPage() {
//   const handleLogin = async (provider: string) => {
//     try {
//       // 백엔드 OAuth 엔드포인트 호출
//       const response = await fetch(`${BACKEND_URL}/api/auth/oauth2/authorize/${provider}`, {
//         method: 'GET',
//         credentials: 'include', // 쿠키가 필요한 경우
//       });

//       if (response.redirected) {
//         // 백엔드가 리다이렉트 URL을 반환하면 브라우저 이동
//         window.location.href = response.url;
//       }
//     } catch (error) {
//       console.error('로그인 처리 중 오류 발생:', error);
//       alert('로그인에 실패했습니다. 다시 시도해주세요.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
//         <h1 className="text-3xl font-bold mb-6">로그인</h1>
//         <p className="text-gray-600 mb-4">소셜 계정으로 간편하게 시작하세요</p>

//         <div className="space-y-4">
//           <Button
//             className="w-full flex items-center justify-center gap-3 text-lg bg-[#E9E9E9] text-black hover:bg-[#D3D3D3]"
//             onClick={() => handleLogin('google')}
//           >
//             <FcGoogle className="w-6 h-6" />
//             Google로 로그인
//           </Button>

//           <Button
//             className="w-full flex items-center justify-center gap-3 text-lg bg-[#FEE500] text-black hover:bg-[#FDD835]"
//             onClick={() => handleLogin('kakao')}
//           >
//             <SiKakaotalk className="w-6 h-6" />
//             Kakao로 로그인
//           </Button>

//           <Button
//             className="w-full flex items-center justify-center gap-3 text-lg bg-[#03C75A] text-white hover:bg-[#02B14F]"
//             onClick={() => handleLogin('naver')}
//           >
//             <SiNaver className="w-6 h-6" />
//             Naver로 로그인
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk, SiNaver } from "react-icons/si";

const BACKEND_URL = "http://localhost:8080";

/**
 * 컴포넌트 대체:
 * 1. Button 대신 HTML <button> 태그 사용
 * 2. Input 대신 HTML <input> 태그 사용
 * 3. Label 대신 HTML <label> 태그 사용
 */

// ****************************
// * Tailwind CSS 기본 스타일 정의
// ****************************

// Button 스타일 (재사용성을 위해 별도 함수로 정의)
const getButtonStyle = (base: string, bgColor: string, hoverColor: string) => 
    `${base} ${bgColor} ${hoverColor} w-full flex items-center justify-center gap-3 text-lg py-2 px-4 rounded-lg font-semibold transition duration-150 ease-in-out`;

// Input/Label 스타일 (기본 스타일)
const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out";
const labelStyle = "block text-sm font-medium text-gray-700";


export default function LoginPage() {
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    // 1. 소셜 로그인 핸들러 (OAuth2 시작)
    const handleSocialLogin = (provider: string) => {
        const oauthStartUrl: string = `${BACKEND_URL}/oauth2/authorization/${provider}`;
        window.location.href = oauthStartUrl;
    };

    // 2. 자체 로그인 핸들러 (폼 제출)
    const handleFormLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const LOGIN_PROCESSING_URL: string = `${BACKEND_URL}/auth/login`; 

        try {
            const response = await fetch(LOGIN_PROCESSING_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userId, 
                    password: password, 
                }).toString(),
                credentials: 'include',
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else if (response.status === 401) {
                alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            } else if (!response.ok) {
                console.error('서버 응답 오류:', response.status);
                alert('로그인 중 서버 오류가 발생했습니다.');
            }
            
        } catch (error) {
            console.error('로그인 처리 중 오류 발생:', error);
            alert('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
                <h1 className="text-3xl font-bold mb-6">로그인</h1>
                <p className="text-gray-600 mb-4">계정 또는 소셜 계정으로 로그인하세요</p>

                {/* 1. 자체 로그인 폼 */}
                <form onSubmit={handleFormLogin} className="space-y-4">
                    <div className="space-y-2 text-left">
                        {/* Label 대체 */}
                        <label htmlFor="userId" className={labelStyle}>아이디</label>
                        {/* Input 대체 */}
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
                        {/* Label 대체 */}
                        <label htmlFor="password" className={labelStyle}>비밀번호</label>
                        {/* Input 대체 */}
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
                    {/* Button 대체 */}
                    <button type="submit" className={getButtonStyle("text-white", "bg-blue-600", "hover:bg-blue-700")}>
                        로그인
                    </button>
                </form>

                {/* 구분선 */}
                <div className="flex items-center space-x-2 my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-gray-500 text-sm">또는 소셜 로그인</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* 2. 소셜 로그인 버튼 */}
                <div className="space-y-4">
                    {/* Google Button 대체 */}
                    <button
                        className={getButtonStyle("text-black", "bg-[#E9E9E9]", "hover:bg-[#D3D3D3]")}
                        onClick={() => handleSocialLogin('google')}
                    >
                        <FcGoogle className="w-6 h-6" />
                        Google로 로그인
                    </button>

                    {/* Kakao Button 대체 */}
                    <button
                        className={getButtonStyle("text-black", "bg-[#FEE500]", "hover:bg-[#FDD835]")}
                        onClick={() => handleSocialLogin('kakao')}
                    >
                        <SiKakaotalk className="w-6 h-6" />
                        Kakao로 로그인
                    </button>

                    {/* Naver Button 대체 */}
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