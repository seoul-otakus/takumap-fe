'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out";
const labelStyle = "block text-sm font-medium text-gray-700";
const buttonStyle = "w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 ease-in-out";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const BASE_URL : string = `${BACKEND_URL}/api/v1/users`;

export default function ResetPasswordPage() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSendTempPassword = async () => {
        const SEND_TEMP_PASSWORD_URL: string = `${BASE_URL}/sent-onetime-password`;
        try {
            const response = await fetch(SEND_TEMP_PASSWORD_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    email: email,
                }),
            });

            if (response.ok) {
                alert('임시 비밀번호가 이메일로 전송되었습니다.');
            } else {
                alert('임시 비밀번호 전송에 실패했습니다. 입력한 정보를 확인해주세요.');
            }
        } catch (error) {
            console.error('임시 비밀번호 전송 중 오류 발생:', error);
            alert('임시 비밀번호 전송 중 오류가 발생했습니다.');
        }
    };
    
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const RESET_PASSWORD_URL: string = `${BASE_URL}/reset-password`;

        try {
            const response = await fetch(RESET_PASSWORD_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    email: email,
                    tempPassword: tempPassword,
                    newPassword: newPassword,
                }),
            });

            if (response.ok) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                router.push('/login');
            } else {
                alert('비밀번호 변경에 실패했습니다. 입력한 정보를 확인해주세요.');
            }
        } catch (error) {
            console.error('비밀번호 변경 중 오류 발생:', error);
            alert('비밀번호 변경 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
                <h1 className="text-3xl font-bold mb-6">비밀번호 재설정</h1>
                
                <div className="space-y-4 text-left">
                    <div className="space-y-2">
                        <label htmlFor="userId" className={labelStyle}>아이디</label>
                        <input
                            id="userId"
                            type="text"
                            placeholder="아이디를 입력하세요"
                            required
                            className={inputStyle}
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
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
                    <button onClick={handleSendTempPassword} className={buttonStyle}>
                        임시 비밀번호 전송
                    </button>
                </div>

                <div className="flex items-center space-x-2 my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label htmlFor="tempPassword" className={labelStyle}>임시 비밀번호</label>
                        <input
                            id="tempPassword"
                            type="password"
                            placeholder="임시 비밀번호를 입력하세요"
                            required
                            className={inputStyle}
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 text-left">
                        <label htmlFor="newPassword" className={labelStyle}>새 비밀번호</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="새 비밀번호를 입력하세요"
                            required
                            className={inputStyle}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={buttonStyle}>
                        비밀번호 변경
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
