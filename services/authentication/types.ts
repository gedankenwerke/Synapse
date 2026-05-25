export type LoginRequestBody = {
    username: string;
    password: string;
};

// Frontend types (snake_case)
export type LoginRequestUser = {
    id: string;
    username: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
};

export type LoginRequestResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: LoginRequestUser;
};

export type RefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
};

// API types (PascalCase — matches what the API actually returns)
export type ApiLoginRequestUser = {
    ID: string;
    Username: string;
    TenantID: string;
    CreatedAt: string;
    UpdatedAt: string;
};

export type ApiLoginRequestResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: ApiLoginRequestUser;
};

export type ApiRefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
};

// Mappers: API → Frontend
export function mapApiLoginUser(api: ApiLoginRequestUser): LoginRequestUser {
    return {
        id: api.ID,
        username: api.Username,
        tenant_id: api.TenantID,
        created_at: api.CreatedAt,
        updated_at: api.UpdatedAt,
    };
}

export function mapApiLoginResponse(api: ApiLoginRequestResponse): LoginRequestResponse {
    return {
        access_token: api.access_token,
        refresh_token: api.refresh_token,
        token_type: api.token_type,
        expires_in: api.expires_in,
        user: mapApiLoginUser(api.user),
    };
}

export function mapApiRefreshResponse(api: ApiRefreshTokenResponse): RefreshTokenResponse {
    return {
        access_token: api.access_token,
        refresh_token: api.refresh_token,
        token_type: api.token_type,
        expires_in: api.expires_in,
    };
}