export interface AccessTokenPayload {
    sub: string;
    sessionId: string;
}

export interface RefreshTokenPayload {
    sessionId: string;
}
