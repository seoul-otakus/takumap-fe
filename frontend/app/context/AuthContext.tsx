"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { User } from "@/app/types";
import { getCurrentUser } from "@/app/lib/authApi";
import api from "@/lib/api";

// 1. 컨텍스트에서 다룰 값들의 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// 2. 컨텍스트 생성 (초기값은 undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider 컴포넌트 정의
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 앱 시작 시 인증 상태 확인 중임을 표시

  // 앱이 처음 로드될 때 한 번만 실행되는 인증 확인 로직
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        } else {
          // 사용자가 없는 경우(인증 실패 또는 토큰 없음)
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("AuthProvider 인증 체크 실패:", error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false); // 인증 확인이 끝나면 로딩 상태 해제
      }
    };

    verifyAuth();
  }, []);

  // 로그인 시 상태 업데이트 함수
  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
  };

  // 로그아웃 처리 함수
  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      // 페이지를 새로고침하여 모든 상태를 초기화하고,
      // 서버로부터 최신 데이터를 다시 받아오도록 함
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 문제가 발생했습니다.");
    }
  };

  // 컨텍스트에 제공할 값들
  const value = {
    isLoggedIn,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. 컨텍스트를 쉽게 사용하기 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
