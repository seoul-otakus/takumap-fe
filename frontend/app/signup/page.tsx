'use client';
import { useState } from 'react';

// Tailwind CSS 기본 스타일 정의
const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out";
const labelStyle = "block text-sm font-medium text-gray-700";
const buttonStyle = "w-full text-white bg-blue-600 hover:bg-blue-700 text-lg py-2 px-4 rounded-lg font-semibold transition duration-150 ease-in-out";
// 중복 확인/인증 버튼 스타일
const sideButtonStyle = "flex-shrink-0 ml-2 py-3 px-4 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-150";
const inputGroupStyle = "flex items-center space-x-2"; // input과 버튼을 가로로 배열하기 위한 스타일

const BACKEND_URL = "http://localhost:8080";
const BASE_AUTH_URL : string = `${BACKEND_URL}/api/v1/auth`;

export default function SignupPage() {
    const [userId, setUserId] = useState<string>('');
    const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [certificationNumber, setVerificationCode] = useState<string>(''); // 인증번호 상태 -> 백엔드의 certificationNumber와 매핑

    // 인증 관련 상태
    const [isIdChecked, setIsIdChecked] = useState<boolean>(false); // 아이디 중복 확인 여부
    const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false); // 닉네임 중복 확인 여부
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); // 이메일 인증 완료 여부
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false); // 인증번호 전송 여부

    // 공통 Fetch 래퍼(에러 처리용)
    const requestApi = async (url: string, body: Record<string, string>) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });
        const result = await response.json();
        if(!response.ok){
            throw new Error(result.message || 'API 요청 중 오류가 발생했습니다.');
        }
        return result;
    };

    //  아이디 중복 확인 핸들러
    const handleIdCheck = async () => {
        console.log('아이디 중복 확인 요청:', userId);
        if (userId.length < 4) {
             alert('아이디는 4자 이상이어야 합니다.');
             setIsIdChecked(false);
             return;
        }

        try{
            await requestApi(`${BASE_AUTH_URL}/id-check`, { userId : userId });
            alert('사용 가능한 아이디입니다.');
            setIsIdChecked(true);
        } catch {
            alert('이미 사용 중인 아이디입니다.');
            setIsIdChecked(false);
        }
    };

    // 닉네임 중복 확인 핸들러
    const handleNicknameCheck = async () => {
        if (nickname.length < 2) {
             alert('닉네임은 2자 이상이어야 합니다.');
             setIsNicknameChecked(false);
             return;
        }

        try{
            await requestApi(`${BASE_AUTH_URL}/nickname-check`, { nickname  : nickname});
            alert('사용 가능한 닉네임입니다.');
            setIsNicknameChecked(true);
        } catch {
            alert('이미 사용 중인 닉네임입니다.');
            setIsNicknameChecked(false);
        }
    };

   // 이메일 인증번호 발송 (POST /email-certification)
    const handleEmailVerifySend = async () => {
        if (!userId) return alert('아이디를 먼저 입력해주세요.');
        try {
            // 백엔드 EmailCertificationRequestDTO는 userId와 email을 모두 받을 수 있도록 설계되어 있음
            await requestApi(`${BASE_AUTH_URL}/email-certification`, { userId : userId, email : email });
            alert(`인증번호가 ${email}로 발송되었습니다.`);
            setIsCodeSent(true);
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'API 요청 중 오류가 발생했습니다.');
        }
    };

    // 인증번호 확인 (POST /check-certification)
    const handleCertifyCheck = async () => {
        try {
            await requestApi(`${BASE_AUTH_URL}/check-certification`, {
                userId : userId,
                email : email,
                certificationNumber : certificationNumber
            });
            alert('이메일 인증이 완료되었습니다. ✅');
            setIsEmailVerified(true);
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'API 요청 중 오류가 발생했습니다.');
            setIsEmailVerified(false);
        }
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
            await requestApi(`${BASE_AUTH_URL}/sign-up`, {
                userId : userId, password : password, email : email, nickname : nickname, certificationNumber : certificationNumber
            });
            alert('회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.');
            window.location.href = '/login';
        } catch {
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    }

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
                        <label htmlFor="certificationNumber" className={labelStyle}>인증번호</label>
                        <div className={inputGroupStyle}>
                            <input
                                id="certificationNumber"
                                type="text"
                                placeholder="인증번호 6자리를 입력해주세요"
                                required
                                maxLength={6}
                                className={inputStyle + (isEmailVerified ? " border-green-500" : "")}
                                value={certificationNumber}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                // 코드가 발송되지 않았거나, 인증 완료된 경우 입력 불가
                                disabled={isEmailVerified || !isCodeSent} 
                            />
                            <button
                                type="button"
                                onClick={handleCertifyCheck}
                                className={sideButtonStyle}
                                // 인증 완료 상태이거나, 코드가 6자리가 아니거나, 코드가 발송되지 않았으면 비활성화
                                disabled={isEmailVerified || certificationNumber.length !== 6 || !isCodeSent}
                            >
                                {isEmailVerified ? '인증 완료' : '인증 확인'}
                            </button>
                        </div>
                    </div>

                    {/* 5. 비밀번호 입력 */}
                    <div className="space-y-1 text-left"> {/* space-y-4의 영향을 받는 하나의 그룹 */}
                        <div className="space-y-2">
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
                        {/* mt-1 또는 space-y-1을 통해 인풋창 바로 밑에 붙게 설정 */}
                        <p className="text-[11px] text-gray-500 ml-1">
                            * 영문자(대소문자), 숫자, 특수문자(!@#$%^&+=) 포함 8~15글자
                        </p>
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