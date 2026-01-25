// lib/auth/auth.service.ts

import { providers } from './providers';
import { generateRandomString, generateCodeChallenge } from './pkce';
import { exchangeCodeForToken, fetchUserInfo } from './oauth';
import type { AuthProvider, LoginInfo } from '$lib/types/auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface BackendUserInfo {
	sub: string | null;
	email: string;
	username: string | null;
	picture: string | null;
	provider: 'google' | 'authentik';
	role?: string;
}

/**
 * Verify user with backend. Returns role only if 'user', otherwise empty.
 */
export async function verifyWithBackend(accessToken: string): Promise<BackendUserInfo | null> {
	const response = await fetch(`${BACKEND_URL}/api/login/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		return null;
	}

	const data: BackendUserInfo = await response.json();

	// Only 'user' role can use the app
	if (data.role !== 'user') {
		data.role = undefined;
	}

	return data;
}

export async function startLogin(providerName: AuthProvider) {
	const provider = providers[providerName];

	const codeVerifier = generateRandomString(128);
	const codeChallenge = await generateCodeChallenge(codeVerifier);
	const state = generateRandomString(32);

	sessionStorage.setItem(`pkce_${providerName}`, codeVerifier);
	sessionStorage.setItem(`state_${providerName}`, state);

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: provider.clientId,
		redirect_uri: provider.redirectUri,
		scope: provider.scope,
		state,
		code_challenge: codeChallenge,
		code_challenge_method: 'S256'
	});

	// Google-specific: request offline access for refresh tokens
	if (providerName === 'google') {
		params.set('access_type', 'offline');
		params.set('prompt', 'consent');
	}

	console.log(`[OAuth] Starting ${providerName} login`, {
		clientId: provider.clientId ? '✓' : '✗ MISSING',
		redirectUri: provider.redirectUri
	});

	window.location.href = `${provider.authorizeUrl}?${params.toString()}`;
}

export async function handleOAuthCallback(
	providerName: AuthProvider,
	code: string,
	state: string
): Promise<LoginInfo> {
	const provider = providers[providerName];

	const savedState = sessionStorage.getItem(`state_${providerName}`);
	const verifier = sessionStorage.getItem(`pkce_${providerName}`);

	if (!verifier || state !== savedState) {
		throw new Error('Invalid OAuth state');
	}

	// Build token exchange params
	const tokenParams: Record<string, string> = {
		grant_type: 'authorization_code',
		code,
		redirect_uri: provider.redirectUri,
		client_id: provider.clientId,
		code_verifier: verifier
	};

	// Google requires client_secret (not a public client)
	if (providerName === 'google') {
		const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
		if (clientSecret) {
			tokenParams.client_secret = clientSecret;
		}
	}

	const tokens = await exchangeCodeForToken(provider.tokenUrl, tokenParams);

	const userInfo = await fetchUserInfo(provider.userInfoUrl, tokens.access_token);

	// Verify user with backend - role will be empty if not 'user'
	const backendUser = await verifyWithBackend(tokens.access_token);

	return {
		provider: providerName,
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token,
		idToken: tokens.id_token,
		expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : undefined,
		userInfo,
		role: backendUser?.role
	};
}
