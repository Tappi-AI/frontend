<!-- src/routes/debug/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore, logout } from '$lib/stores/auth.store';

	const handleLogout = () => {
		logout();
		goto('/login');
	};

	const getProviderBadgeColor = (provider: string) => {
		const colors: Record<string, string> = {
			authentik: 'bg-blue-100 text-blue-800 border-blue-200',
			google: 'bg-red-100 text-red-800 border-red-200',
			microsoft: 'bg-sky-100 text-sky-800 border-sky-200',
			local: 'bg-green-100 text-green-800 border-green-200'
		};
		return colors[provider] || 'bg-gray-100 text-gray-800 border-gray-200';
	};

	// Environment config for debugging
	const envConfig = {
		backendUrl: import.meta.env.VITE_BACKEND_URL,
		googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
		googleClientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
		googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
		authentikUrl: import.meta.env.VITE_AUTHENTIK_URL,
		authentikClientId: import.meta.env.VITE_AUTHENTIK_CLIENT_ID ? '✓ Set' : '✗ Missing',
		authentikRedirectUri: import.meta.env.VITE_AUTHENTIK_REDIRECT_URI
	};
</script>

{#if $authStore}
	<div class="min-h-screen bg-gray-50 p-8">
		<div class="mx-auto max-w-4xl">
			<div class="rounded-lg bg-white p-8 shadow-lg">
				<div class="mb-8 flex items-center justify-between">
					<div class="flex items-center gap-4">
						<h1 class="text-3xl font-bold text-gray-900">Debug Info</h1>
						<span
							class={`rounded-full border px-3 py-1 text-sm font-semibold ${getProviderBadgeColor($authStore.provider)}`}
						>
							{$authStore.provider.charAt(0).toUpperCase() + $authStore.provider.slice(1)}
						</span>
					</div>
					<button
						onclick={handleLogout}
						class="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
					>
						Logout
					</button>
				</div>

				<div class="space-y-6">
					<div>
						<h2 class="mb-4 text-xl font-semibold text-gray-800">Authentication Information</h2>
					</div>

					{#if $authStore.userInfo}
						<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<h3 class="mb-2 font-semibold text-blue-900">User Info</h3>
							<div class="space-y-1 text-sm">
								{#if $authStore.userInfo.name}
									<p><span class="font-medium">Name:</span> {$authStore.userInfo.name}</p>
								{/if}
								{#if $authStore.userInfo.email}
									<p><span class="font-medium">Email:</span> {$authStore.userInfo.email}</p>
								{/if}
								{#if $authStore.userInfo.preferred_username}
									<p>
										<span class="font-medium">Username:</span>
										{$authStore.userInfo.preferred_username}
									</p>
								{/if}
								{#if $authStore.userInfo.picture}
									<div class="mt-3 flex items-center gap-3">
										<span class="font-medium">Avatar:</span>
										<img
											src={$authStore.userInfo.picture}
											alt="Profile"
											class="h-12 w-12 rounded-full border-2 border-blue-300"
										/>
									</div>
								{/if}
								<p><span class="font-medium">Subject:</span> {$authStore.userInfo.sub}</p>
							</div>
						</div>
					{/if}

					<div class="rounded-lg border border-green-200 bg-green-50 p-4">
						<h3 class="mb-2 font-semibold text-green-900">Access Token</h3>
						<p class="break-all font-mono text-xs text-gray-700">{$authStore.accessToken}</p>
					</div>

					{#if $authStore.refreshToken}
						<div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
							<h3 class="mb-2 font-semibold text-purple-900">Refresh Token</h3>
							<p class="break-all font-mono text-xs text-gray-700">{$authStore.refreshToken}</p>
						</div>
					{/if}

					{#if $authStore.idToken}
						<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
							<h3 class="mb-2 font-semibold text-yellow-900">ID Token</h3>
							<p class="break-all font-mono text-xs text-gray-700">{$authStore.idToken}</p>
						</div>
					{/if}

					{#if $authStore.expiresAt}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<h3 class="mb-2 font-semibold text-gray-900">Token Expiration</h3>
							<p class="text-sm text-gray-700">
								Expires at: {new Date($authStore.expiresAt * 1000).toLocaleString()}
							</p>
						</div>
					{/if}

					<div class="rounded-lg border border-orange-200 bg-orange-50 p-4">
						<h3 class="mb-2 font-semibold text-orange-900">Environment Config</h3>
						<div class="space-y-1 text-sm">
							<p><span class="font-medium">Backend URL:</span> {envConfig.backendUrl}</p>
							<p><span class="font-medium">Google Client ID:</span> {envConfig.googleClientId}</p>
							<p><span class="font-medium">Google Client Secret:</span> {envConfig.googleClientSecret}</p>
							<p><span class="font-medium">Google Redirect:</span> {envConfig.googleRedirectUri}</p>
							<p><span class="font-medium">Authentik URL:</span> {envConfig.authentikUrl}</p>
							<p><span class="font-medium">Authentik Client ID:</span> {envConfig.authentikClientId}</p>
							<p><span class="font-medium">Authentik Redirect:</span> {envConfig.authentikRedirectUri}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 p-8">
		<div class="mx-auto max-w-4xl">
			<div class="rounded-lg bg-white p-8 shadow-lg">
				<h1 class="mb-6 text-3xl font-bold text-gray-900">Debug Info</h1>
				<p class="mb-6 text-gray-600">Not logged in</p>

				<div class="space-y-6">
					<div class="rounded-lg border border-orange-200 bg-orange-50 p-4">
						<h3 class="mb-2 font-semibold text-orange-900">Environment Config</h3>
						<div class="space-y-1 text-sm">
							<p><span class="font-medium">Backend URL:</span> {envConfig.backendUrl}</p>
							<p><span class="font-medium">Google Client ID:</span> {envConfig.googleClientId}</p>
							<p><span class="font-medium">Google Client Secret:</span> {envConfig.googleClientSecret}</p>
							<p><span class="font-medium">Google Redirect:</span> {envConfig.googleRedirectUri}</p>
							<p><span class="font-medium">Authentik URL:</span> {envConfig.authentikUrl}</p>
							<p><span class="font-medium">Authentik Client ID:</span> {envConfig.authentikClientId}</p>
							<p><span class="font-medium">Authentik Redirect:</span> {envConfig.authentikRedirectUri}</p>
						</div>
					</div>

					<a
						href="/login"
						class="inline-block rounded-lg bg-purple-600 px-6 py-3 text-white transition hover:bg-purple-700"
					>
						Go to Login
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
