'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UserListItem } from '@/app/types';
import { getAllUsers, deleteUser } from '@/app/lib/adminApi';
import { getCurrentUser } from '@/app/lib/authApi';
import { Trash2, ArrowLeft, Shield, User as UserIcon } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check admin access on mount
    useEffect(() => {
        checkAdminAccess();
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(currentPage, 20);
            setUsers(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setError(null);
        } catch (err) {
            setError('사용자 목록을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    // Load users when page changes
    useEffect(() => {
        if (isAdmin) {
            loadUsers();
        }
    }, [isAdmin, loadUsers]);

    const checkAdminAccess = async () => {
        try {
            const user = await getCurrentUser();
            if (user.role !== 'ROLE_ADMIN') {
                setError('관리자 권한이 필요합니다.');
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        } catch {
            setError('인증에 실패했습니다. 로그인이 필요합니다.');
            setIsAdmin(false);
        }
    };

    const handleDeleteUser = async (userId: number, nickname: string) => {
        const confirmed = window.confirm(
            `정말로 "${nickname}" 사용자를 삭제하시겠습니까?\n\n` +
            '이 작업은 되돌릴 수 없으며, 해당 사용자의 모든 리뷰도 함께 삭제됩니다.'
        );

        if (!confirmed) return;

        try {
            await deleteUser(userId);
            alert('사용자가 성공적으로 삭제되었습니다.');
            loadUsers(); // Reload the list
        } catch (err) {
            alert('사용자 삭제에 실패했습니다.');
            console.error(err);
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === 'ROLE_ADMIN') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <Shield className="w-3 h-3" />
                    관리자
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                <UserIcon className="w-3 h-3" />
                일반
            </span>
        );
    };

    const getProviderName = (provider: string) => {
        const providers: Record<string, string> = {
            'LOCAL': '로컬',
            'GOOGLE': '구글',
            'KAKAO': '카카오',
            'NAVER': '네이버'
        };
        return providers[provider] || provider;
    };

    if (!isAdmin && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⛔</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">접근 권한 없음</h1>
                    <p className="text-gray-600 mb-6">{error || '관리자 권한이 필요합니다.'}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white hover:text-purple-100 transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        메인으로
                    </Link>
                    <h1 className="text-3xl font-bold">사용자 관리</h1>
                    <p className="text-purple-100 mt-2">
                        총 {totalElements}명의 사용자
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto py-8 px-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">로딩 중...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={loadUsers}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : (
                    <>
                        {/* User Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                닉네임
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                아이디
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                이메일
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                역할
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                가입 방식
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                가입일
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                작업
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {user.nickname}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {user.userId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {getProviderName(user.provider)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.nickname)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                        title="사용자 삭제"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    이전
                                </button>
                                <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                                    {currentPage + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
