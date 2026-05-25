import httpClient from "@/libs/axios";
import { LoginRequestBody, LoginRequestResponse, RefreshTokenResponse, ApiLoginRequestResponse, ApiRefreshTokenResponse, mapApiLoginResponse, mapApiRefreshResponse } from './types';
import { ResponseWrapper } from '@/types/response';

export const authentication = {
    login: async (payload: LoginRequestBody): Promise<LoginRequestResponse> => {
        const response = await httpClient.post<ResponseWrapper<ApiLoginRequestResponse>>('/api/v1/login', payload);
        const apiData = (response as unknown as ResponseWrapper<ApiLoginRequestResponse>).data;
        return mapApiLoginResponse(apiData);
    },

    me: async (): Promise<boolean> => {
        await httpClient.post('/api/v1/me');
        return true;
    },

    refresh: async (): Promise<RefreshTokenResponse> => {
        const response = await httpClient.get<ResponseWrapper<ApiRefreshTokenResponse>>('/api/v1/token');
        const apiData = (response as unknown as ResponseWrapper<ApiRefreshTokenResponse>).data;
        return mapApiRefreshResponse(apiData);
    },
};