<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { loginStore } from '$lib/stores/login.store';
	import { goto } from '$app/navigation';

	// Authentik OAuth configuration
	const AUTHENTIK_URL = import.meta.env.VITE_AUTHENTIK_URL;
	const AUTHENTIK_CLIENT_ID = import.meta.env.VITE_AUTHENTIK_CLIENT_ID;
	const AUTHENTIK_REDIRECT_URI = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI;
	const SCOPE = 'openid profile email';

	onMount(() => {
		// If already logged in, redirect to home
		if ($loginStore) {
			goto('/');
		}
	});

	function generateRandomString(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	async function generateCodeChallenge(verifier: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(verifier);
		const hash = await crypto.subtle.digest('SHA-256', data);
		const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	}

	async function loginWithAuthentik() {
		// Generate PKCE parameters
		const codeVerifier = generateRandomString(128);
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		const state = generateRandomString(32);

		// Store PKCE parameters in sessionStorage with provider suffix
		sessionStorage.setItem('pkce_code_verifier_authentik', codeVerifier);
		sessionStorage.setItem('oauth_state_authentik', state);

		// Build authorization URL
		const params = new URLSearchParams({
			response_type: 'code',
			client_id: AUTHENTIK_CLIENT_ID,
			redirect_uri: AUTHENTIK_REDIRECT_URI,
			scope: SCOPE,
			state: state,
			code_challenge: codeChallenge,
			code_challenge_method: 'S256'
		});

		const authUrl = `${AUTHENTIK_URL}/application/o/authorize/?${params.toString()}`;

		// Redirect to Authentik
		window.location.href = authUrl;
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h1>
			<p class="text-gray-600">Sign in to continue to your account</p>
		</div>

		<div class="space-y-4">
			<button
				on:click={loginWithAuthentik}
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700 hover:shadow-lg"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
						clip-rule="evenodd"
					/>
				</svg>
				Login with Authentik
			</button>

			<div class="mt-6 text-center text-sm text-gray-500">
				<p>Secured by Authentik</p>
				<p class="mt-1 text-xs">authentik.posetmage.com</p>
			</div>
		</div>
	</div>
</div>
