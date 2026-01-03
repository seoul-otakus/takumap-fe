import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버 주소
    withCredentials: true
});

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async(error) => {
        const originalRequest = error.config;

        const errorMessage = error.response?.data?.message || '';

        if(error.response?.status === 401 && errorMessage === "유효하지 않은 토큰입니다.") {
            originalRequest._retry = true;

            try {
                await api.post('/api/v1/auth/refresh');
                console.log('토큰 재발급 성공, 원래 요청을 재시도합니다.');
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh Token이 유효하지 않습니다. 로그아웃 처리합니다.', refreshError);

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;