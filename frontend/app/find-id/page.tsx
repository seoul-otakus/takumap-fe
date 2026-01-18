'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out";
const labelStyle = "block text-sm font-medium text-gray-700";
const buttonStyle = "w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 ease-in-out";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const BASE_URL : string = `${BACKEND_URL}/api/v1/users`;

export default function FindIdPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       
       const FIND_ID_URL: string = `${BASE_URL}/find-id`;

       try{
        const response = await fetch(FIND_ID_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        
        const result = await response.json();

        if (response.ok) {
            alert(`찾은 아이디: ${result.data}`);
        } else {
            alert('아이디를 찾을 수 없습니다.');
        }
       } catch (error) {
        console.error('회원 조회 중 오류 발생:', error);
        alert('아이디 찾기 중 오류가 발생했습니다.');
       }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
                <h1 className="text-3xl font-bold mb-6">아이디 찾기</h1>
                <p className="text-gray-600 mb-4">가입 시 사용한 이메일을 입력해주세요.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label htmlFor="email" className={labelStyle}>이메일</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            required
                            className={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={buttonStyle}>
                        아이디 찾기
                    </button>
                </form>

                <button 
                    type="button" 
                    onClick={() => router.push('/login')} 
                    className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150 mt-2"
                >
                    로그인 페이지로 돌아가기
                </button>
            </div>
        </div>
    );
}
