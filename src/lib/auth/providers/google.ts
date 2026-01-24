// lib/auth/providers/google.ts

import type { OAuthProviderConfig } from '$lib/types/auth';

export const googleProvider: OAuthProviderConfig & { clientSecret?: string } = {
	name: 'google',
	authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
	tokenUrl: 'https://oauth2.googleapis.com/token',
	userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
	clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
	redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
	scope: 'openid profile email'
};
