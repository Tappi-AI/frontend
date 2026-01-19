// src/lib/types/auth.ts

export type AuthProvider = 'authentik' | 'google' | 'microsoft' | 'local';

export interface UserInfo {
	sub: string;
	email?: string;
	name?: string;
	preferred_username?: string;
	picture?: string;
}

export interface LoginInfo {
	provider: AuthProvider;
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	expiresAt?: number;
	userInfo?: UserInfo;
}

export interface OAuthTokens {
	access_token: string;
	refresh_token?: string;
	id_token?: string;
	expires_in?: number;
}

export interface OAuthProviderConfig {
	name: AuthProvider;
	authorizeUrl: string;
	tokenUrl: string;
	userInfoUrl: string;
	clientId: string;
	redirectUri: string;
	scope: string;
}
