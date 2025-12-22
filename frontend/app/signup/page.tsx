'use client';
import { useState } from 'react';

// Tailwind CSS 기본 스타일 정의
const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out";
const labelStyle = "block text-sm font-medium text-gray-700";
const buttonStyle = "w-full text-white bg-blue-600 hover:bg-blue-700 text-lg py-2 px-4 rounded-lg font-semibold transition duration-150 ease-in-out";
// 중복 확인/인증 버튼 스타일
const sideButtonStyle = "flex-shrink-0 ml-2 py-3 px-4 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-150";
const inputGroupStyle = "flex items-center space-x-2"; // input과 버튼을 가로로 배열하기 위한 스타일

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SignupPage() {
    const [userId, setUserId] = useState<string>('');
    const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>(''); // 인증번호 상태

    // 인증 관련 상태
    const [isIdChecked, setIsIdChecked] = useState<boolean>(false); // 아이디 중복 확인 여부
    const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false); // 닉네임 중복 확인 여부
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); // 이메일 인증 완료 여부
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false); // 인증번호 전송 여부

    // 백엔드 API 호출 경로
    const SIGNUP_API_URL: string = `${BACKEND_URL}/auth/signup`;

    // 💡 (임시) 아이디 중복 확인 핸들러
    const handleIdCheck = async () => {
        // 실제 API 호출 (예: /api/v1/auth/check-userId) 로직이 여기에 들어갑니다.
        console.log('아이디 중복 확인 요청:', userId);
        if (userId.length < 4) {
             alert('아이디는 4자 이상이어야 합니다.');
             setIsIdChecked(false);
             return;
        }

        // --- Mock Logic Start (실제 백엔드 응답을 가정) ---
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (userId === 'testuser') { 
            alert('이미 사용 중인 아이디입니다.');
            setIsIdChecked(false);
        } else {
            alert('사용 가능한 아이디입니다.');
            setIsIdChecked(true);
        }
        // --- Mock Logic End ---
    };

    // 💡 (임시) 닉네임 중복 확인 핸들러
    const handleNicknameCheck = async () => {
        // 실제 API 호출 (예: /api/v1/auth/check-nickname) 로직이 여기에 들어갑니다.
        console.log('닉네임 중복 확인 요청:', nickname);
        if (nickname.length < 2) {
             alert('닉네임은 2자 이상이어야 합니다.');
             setIsNicknameChecked(false);
             return;
        }
        
        // --- Mock Logic Start (실제 백엔드 응답을 가정) ---
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (nickname === '중복닉') {
            alert('이미 사용 중인 닉네임입니다.');
            setIsNicknameChecked(false);
        } else {
            alert('사용 가능한 닉네임입니다.');
            setIsNicknameChecked(true);
        }
        // --- Mock Logic End ---
    };

    // 💡 이메일 인증번호 전송 버튼 핸들러
    const handleEmailVerifySend = async () => {
        // 실제 API 호출 (예: /api/v1/email/send-code) 로직이 여기에 들어갑니다.
        console.log('이메일 인증번호 전송 요청:', email);
        
        // 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('유효하지 않은 이메일 형식입니다.');
            return;
        }

        if (isEmailVerified) {
             alert('이미 이메일 인증이 완료되었습니다.');
             return;
        }
        
        // --- Mock Logic Start (실제 이메일 전송을 가정) ---
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsCodeSent(true); // 코드가 성공적으로 전송되었다고 표시
            setIsEmailVerified(false); // 재전송 시 인증 상태 초기화
            alert(`인증번호가 ${email}로 발송되었습니다. (모의: 1234)`);
        } catch (error) {
            alert('이메일 발송에 실패했습니다. 이메일 주소를 확인해주세요.');
        }
        // --- Mock Logic End ---
    };

    // 💡 인증번호 확인 버튼 핸들러
    const handleCertifyCheck = async () => {
        // 실제 API 호출 (예: /api/v1/email/verify-code) 로직이 여기에 들어갑니다.
        console.log('인증번호 확인 요청:', verificationCode);
        
        if (!isCodeSent) {
            alert('먼저 이메일 인증번호를 발송해주세요.');
            return;
        }

        if (verificationCode.length !== 4) {
            alert('인증번호 4자리를 정확히 입력해주세요.');
            return;
        }
        
        // --- Mock Logic Start (실제 인증번호 확인을 가정) ---
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (verificationCode === '1234') { // '1234'를 올바른 인증번호로 가정
            alert('이메일 인증이 완료되었습니다. ✅');
            setIsEmailVerified(true);
        } else {
            alert('인증번호가 일치하지 않습니다.');
            setIsEmailVerified(false);
        }
        // --- Mock Logic End ---
    };

    // 최종 회원가입 핸들러
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. 필수 유효성 검사 (프론트엔드)
        if (password !== passwordConfirm) {
            alert('비밀번호와 비밀번호 확인 값이 일치하지 않습니다.');
            return;
        }
        if (!isIdChecked) {
            alert('아이디 중복 확인을 완료해주세요.');
            return;
        }
        if (!isNicknameChecked) {
             alert('닉네임 중복 확인을 완료해주세요.');
             return;
        }
        if (!isEmailVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        try {
            const response = await fetch(SIGNUP_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 백엔드 DTO에 맞게 JSON 본문 생성
                body: JSON.stringify({
                    userId: userId,
                    nickname: nickname, 
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                alert('회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.');
                window.location.href = '/login'; 
            } else if (response.status === 400) {
                // 백엔드 유효성 검사 실패 (아이디 중복, 비밀번호 규칙 등)
                const errorData = await response.json();
                alert(`회원가입 실패: ${errorData.message || '입력 정보를 확인해주세요.'}`);
            } else {
                alert('회원가입 중 서버 오류가 발생했습니다. 다시 시도해주세요.');
            }

        } catch (error) {
            console.error('회원가입 처리 중 오류 발생:', error);
            alert('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
                <h1 className="text-3xl font-bold mb-6 text-blue-600">회원가입</h1>
                <p className="text-gray-600 mb-4">계정 정보를 입력해주세요</p>
                
                <form onSubmit={handleSignup} className="space-y-4">
                    
                    {/* 1. 아이디 입력 */}
                    <div className="space-y-2 text-left">
                        <label htmlFor="userId" className={labelStyle}>아이디</label>
                        <div className={inputGroupStyle}>
                            <input
                                id="userId"
                                type="text"
                                placeholder="아이디를 입력해주세요"
                                required
                                className={inputStyle + (isIdChecked ? " border-green-500" : "")}
                                value={userId}
                                onChange={(e) => { setUserId(e.target.value); setIsIdChecked(false); }}
                                disabled={isIdChecked}
                            />
                            <button type="button" onClick={handleIdCheck} className={sideButtonStyle} disabled={isIdChecked || userId.length < 4}>
                                {isIdChecked ? '확인 완료' : '중복 확인'}
                            </button>
                        </div>
                    </div>

                    {/* 2. 닉네임 입력 */}
                    <div className="space-y-2 text-left">
                        <label htmlFor="nickname" className={labelStyle}>닉네임</label>
                        <div className={inputGroupStyle}>
                            <input
                                id="nickname"
                                type="text"
                                placeholder="닉네임을 입력해주세요"
                                required
                                className={inputStyle + (isNicknameChecked ? " border-green-500" : "")}
                                value={nickname}
                                onChange={(e) => { setNickname(e.target.value); setIsNicknameChecked(false); }}
                                disabled={isNicknameChecked}
                            />
                            <button type="button" onClick={handleNicknameCheck} className={sideButtonStyle} disabled={isNicknameChecked || nickname.length < 2}>
                                {isNicknameChecked ? '확인 완료' : '중복 확인'}
                            </button>
                        </div>
                    </div>
                    
                    {/* 3. 이메일 입력 + 이메일 인증 발송 버튼 */}
                    <div className="space-y-2 text-left">
                        <label htmlFor="email" className={labelStyle}>이메일</label>
                        <div className={inputGroupStyle}>
                            <input
                                id="email"
                                type="email"
                                placeholder="이메일 주소를 입력해주세요"
                                required
                                className={inputStyle + (isEmailVerified ? " border-green-500" : "")}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIsCodeSent(false); 
                                    setIsEmailVerified(false);
                                }}
                                disabled={isEmailVerified} 
                            />
                            <button
                                type="button"
                                onClick={handleEmailVerifySend}
                                className={sideButtonStyle}
                                disabled={isEmailVerified || email.length === 0} 
                            >
                                이메일 인증
                            </button>
                        </div>
                    </div>

                    {/* 4. 인증번호 입력 + 인증 확인 버튼 */}
                    <div className="space-y-2 text-left">
                        <label htmlFor="verificationCode" className={labelStyle}>인증번호</label>
                        <div className={inputGroupStyle}>
                            <input
                                id="verificationCode"
                                type="text"
                                placeholder="인증번호 4자리를 입력해주세요"
                                required
                                maxLength={4}
                                className={inputStyle + (isEmailVerified ? " border-green-500" : "")}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                // 코드가 발송되지 않았거나, 인증 완료된 경우 입력 불가
                                disabled={isEmailVerified || !isCodeSent} 
                            />
                            <button
                                type="button"
                                onClick={handleCertifyCheck}
                                className={sideButtonStyle}
                                // 인증 완료 상태이거나, 코드가 4자리가 아니거나, 코드가 발송되지 않았으면 비활성화
                                disabled={isEmailVerified || verificationCode.length !== 4 || !isCodeSent}
                            >
                                {isEmailVerified ? '인증 완료' : '인증 확인'}
                            </button>
                        </div>
                    </div>

                    {/* 5. 비밀번호 입력 */}
                    <div className="space-y-2 text-left">
                        <label htmlFor="password" className={labelStyle}>비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            required
                            className={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* 6. 비밀번호 확인 입력 */}
                    <div className="space-y-2 text-left">
                        <label htmlFor="passwordConfirm" className={labelStyle}>비밀번호 확인</label>
                        <input
                            id="passwordConfirm"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            required
                            className={inputStyle}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>

                    {/* 회원가입 버튼 */}
                    <button type="submit" className={buttonStyle}>
                        회원가입
                    </button>
                    
                </form>

                {/* 로그인 페이지로 돌아가기 버튼 */}
                <button 
                    type="button" 
                    onClick={() => window.location.href = '/login'} 
                    className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium transition duration-150 mt-4"
                >
                    이미 계정이 있으신가요? &nbsp; 로그인
                </button>
            </div>
        </div>
    );
}