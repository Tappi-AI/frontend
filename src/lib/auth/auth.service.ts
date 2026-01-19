// lib/auth/auth.service.ts

import { providers } from './providers';
import { generateRandomString, generateCodeChallenge } from './pkce';
import { exchangeCodeForToken, fetchUserInfo } from './oauth';
import type { AuthProvider, LoginInfo } from '$lib/types/auth';

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

	const tokens = await exchangeCodeForToken(provider.tokenUrl, {
		grant_type: 'authorization_code',
		code,
		redirect_uri: provider.redirectUri,
		client_id: provider.clientId,
		code_verifier: verifier
	});

	const userInfo = await fetchUserInfo(provider.userInfoUrl, tokens.access_token);

	return {
		provider: providerName,
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token,
		idToken: tokens.id_token,
		expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : undefined,
		userInfo
	};
}
