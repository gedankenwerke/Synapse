import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const baseRequest = axios.create({
    baseURL: '',
    withCredentials: false,
});

baseRequest.interceptors.request.use((config) => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

baseRequest.interceptors.response.use(
    (response) => { return response.data },
    (error: AxiosError) => {
        const serverData = error.response?.data as Record<string, unknown> | undefined;
        return Promise.reject({
            message: (serverData as any)?.message || error.message || 'An unknown error occurred',
            code: error.code,
            status: error.response?.status,
            serverData,
        });
    }
);

export default baseRequest;