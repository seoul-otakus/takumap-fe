import api from "@/lib/api";
import type { ApiResponse, User } from "../types";

/**
 * 아이디 중복 확인
 */
export async function checkUserId(userId: string): Promise<void> {
  const response = await api.post<ApiResponse<null>>('/auth/id-check', { userId });
  return;
}

/**
 * 이메일 인증번호 발송
 */
export async function sendEmailCertification(email: string, userId: string): Promise<void> {
  const response = await api.post<ApiResponse<null>>('/auth/email-certification', {
    email,
    userId
  });
  return;
}

/**
 * 이메일 인증번호 확인
 */
export async function checkCertification(
  userId: string,
  email: string,
  certificationNumber: string
): Promise<void> {
  const response = await api.post<ApiResponse<null>>('/auth/check-certification', {
    userId,
    email,
    certificationNumber
  });
  return;
}

/**
 * 회원가입
 */
export async function signUp(data: {
  userId: string;
  nickname: string;
  email: string;
  password: string;
  certificationNumber: string;
}): Promise<void> {
  const response = await api.post<ApiResponse<null>>('/auth/sign-up', data);
  return;
}

/**
 * 로그인
 */
export async function signIn(userId: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await api.post('/auth/sign-in', { userId, password });
  return response.data.result;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

/**
 * 토큰 갱신
 */
export async function refreshAccessToken(): Promise<void> {
  await api.post('/auth/refresh');
}

/**
 * 사용자 인증 확인
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await api.get('/auth/check');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 현재 로그인한 사용자 정보 조회 (role 포함)
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}
