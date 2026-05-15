import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'auth_token';

const baseRequest = axios.create({
    baseURL: '',
    withCredentials: false,
});

baseRequest.interceptors.request.use((config) => {
    const token = Cookies.get(COOKIE_NAME);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

function processQueue(token: string | null, error: unknown = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (token) {
            resolve(token);
        } else {
            reject(error);
        }
    });
    failedQueue = [];
}

baseRequest.interceptors.response.use(
    (response) => { return response.data },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const serverData = error.response?.data as Record<string, unknown> | undefined;

        // If 401 and we haven't retried yet, try to refresh the token
        if (status === 401 && originalRequest && !originalRequest._retry) {
            // Don't try to refresh if the failing request IS the refresh endpoint
            if (originalRequest.url === '/api/v1/token' || originalRequest.url === '/api/v1/login') {
                return Promise.reject({
                    message: (serverData as any)?.message || error.message || 'Authentication failed',
                    code: error.code,
                    status,
                    serverData,
                });
            }

            if (isRefreshing) {
                // Queue up while another refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (newToken: string) => {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            resolve(baseRequest(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use raw axios (no interceptors) to avoid infinite loop
                // Relative path works because Next.js rewrites proxy /api/* to the backend
                const currentToken = Cookies.get(COOKIE_NAME);
                const response = await axios.get('/api/v1/token', {
                    headers: { Authorization: `Bearer ${currentToken}` },
                });

                const newToken = response.data?.data?.token || response.data?.token;
                if (newToken) {
                    Cookies.set(COOKIE_NAME, newToken, {
                        path: '/',
                        expires: 7,
                        sameSite: 'Strict',
                    });

                    // Dispatch a custom event so the store can update
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('token-refreshed', { detail: newToken }));
                    }

                    processQueue(newToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return baseRequest(originalRequest);
                } else {
                    processQueue(null, error);
                    return Promise.reject({
                        message: 'Token refresh failed',
                        code: error.code,
                        status,
                        serverData,
                    });
                }
            } catch (refreshError) {
                processQueue(null, refreshError);
                // Refresh failed — clear token and redirect to login
                Cookies.remove(COOKIE_NAME, { path: '/' });
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('token-refresh-failed'));
                }
                return Promise.reject({
                    message: 'Session expired. Please log in again.',
                    code: error.code,
                    status: 401,
                    serverData,
                });
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject({
            message: (serverData as any)?.message || error.message || 'An unknown error occurred',
            code: error.code,
            status: error.response?.status,
            serverData,
        });
    }
);

export default baseRequest;