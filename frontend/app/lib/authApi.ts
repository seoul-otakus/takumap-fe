import api from "@/lib/api";
import type { ApiResponse } from "../types";

/**
 * 아이디 중복 확인
 */
export async function checkUserId(userId: string): Promise<void> {
  const response = await api.post<ApiResponse<null>>('/api/v1/auth/id-check', { userId });
  return;
}

/**
 * 이메일 인증번호 발송
 */
export async function sendEmailCertification(email: string, userId: string): Promise<void> {
  const response = await api.post<ApiResponse<null>>('/api/v1/auth/email-certification', {
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
  const response = await api.post<ApiResponse<null>>('/api/v1/auth/check-certification', {
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
  const response = await api.post<ApiResponse<null>>('/api/v1/auth/sign-up', data);
  return;
}

/**
 * 로그인
 */
export async function signIn(userId: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await api.post('/api/v1/auth/sign-in', { userId, password });
  return response.data.result;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await api.post('/api/v1/auth/logout');
}

/**
 * 토큰 갱신
 */
export async function refreshAccessToken(): Promise<void> {
  await api.post('/api/v1/auth/refresh');
}

/**
 * 사용자 인증 확인
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await api.get('/api/v1/auth/check');
    return true;
  } catch (error) {
    return false;
  }
}
