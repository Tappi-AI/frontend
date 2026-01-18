<!-- src/routes/callback/authentik/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loginStore, type LoginInfo } from '$lib/stores/login.store';

	let error = '';
	let processing = true;

	const AUTHENTIK_URL = import.meta.env.VITE_AUTHENTIK_URL;
	const CLIENT_ID = import.meta.env.VITE_AUTHENTIK_CLIENT_ID;
	const REDIRECT_URI = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI;

	async function exchangeCodeForToken(code: string, codeVerifier: string) {
		const tokenUrl = `${AUTHENTIK_URL}/application/o/token/`;

		const params = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: REDIRECT_URI,
			client_id: CLIENT_ID,
			code_verifier: codeVerifier
		});

		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: params.toString()
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Token exchange failed: ${errorText}`);
		}

		return await response.json();
	}

	async function fetchUserInfo(accessToken: string) {
		const userInfoUrl = `${AUTHENTIK_URL}/application/o/userinfo/`;

		const response = await fetch(userInfoUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch user info');
		}

		return await response.json();
	}

	onMount(async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			const state = params.get('state');
			const errorParam = params.get('error');

			if (errorParam) {
				error = `Authentication error: ${errorParam}`;
				processing = false;
				return;
			}

			if (!code) {
				error = 'No authorization code received';
				processing = false;
				return;
			}

			// Verify state
			const savedState = sessionStorage.getItem('oauth_state_authentik');
			if (state !== savedState) {
				error = 'Invalid state parameter';
				processing = false;
				return;
			}

			// Get code verifier
			const codeVerifier = sessionStorage.getItem('pkce_code_verifier_authentik');
			if (!codeVerifier) {
				error = 'Missing PKCE code verifier';
				processing = false;
				return;
			}

			// Exchange code for tokens
			const tokenData = await exchangeCodeForToken(code, codeVerifier);

			// Fetch user info
			const userInfo = await fetchUserInfo(tokenData.access_token);

			// Calculate expiration time
			const expiresAt = tokenData.expires_in
				? Math.floor(Date.now() / 1000) + tokenData.expires_in
				: undefined;

			// Store login info with provider type
			const loginInfo: LoginInfo = {
				provider: 'authentik',
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				idToken: tokenData.id_token,
				expiresAt: expiresAt,
				userInfo: userInfo
			};

			loginStore.set(loginInfo);

			// Clean up session storage
			sessionStorage.removeItem('pkce_code_verifier_authentik');
			sessionStorage.removeItem('oauth_state_authentik');

			// Redirect to home
			goto('/');
		} catch (err) {
			console.error('Authentication error:', err);
			error = err instanceof Error ? err.message : 'Authentication failed';
			processing = false;
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
		{#if processing}
			<div class="text-center">
				<div
					class="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"
				></div>
				<h2 class="mb-2 text-2xl font-semibold text-gray-800">Processing Authentik Login</h2>
				<p class="text-gray-600">Please wait while we complete your authentication...</p>
			</div>
		{:else if error}
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 p-4"
				>
					<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>
				<h2 class="mb-2 text-2xl font-semibold text-gray-800">Authentication Failed</h2>
				<p class="mb-6 text-red-600">{error}</p>
				<button
					on:click={() => goto('/login')}
					class="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
				>
					Return to Login
				</button>
			</div>
		{/if}
	</div>
</div>
