// lib/auth/oauth.ts

import type { OAuthTokens } from '$lib/types/auth';

export async function exchangeCodeForToken(
	tokenUrl: string,
	params: Record<string, string>
): Promise<OAuthTokens> {
	const response = await fetch(tokenUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(params).toString()
	});

	if (!response.ok) {
		throw new Error(await response.text());
	}

	return response.json();
}

export async function fetchUserInfo(userInfoUrl: string, accessToken: string) {
	const res = await fetch(userInfoUrl, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	if (!res.ok) {
		throw new Error('Failed to fetch user info');
	}

	return res.json();
}
