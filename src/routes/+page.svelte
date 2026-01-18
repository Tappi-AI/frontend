<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loginStore, logout } from '$lib/stores/login.store';

	onMount(() => {
		if (!$loginStore) {
			goto('/login');
		}
	});

	const handleLogout = () => {
		logout();
		goto('/login');
	};

	const getProviderBadgeColor = (provider: string) => {
		const colors = {
			authentik: 'bg-blue-100 text-blue-800 border-blue-200',
			local: 'bg-green-100 text-green-800 border-green-200'
		};
		return colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
	};
</script>

{#if $loginStore}
	<div class="min-h-screen bg-gray-50 p-8">
		<div class="mx-auto max-w-4xl">
			<div class="rounded-lg bg-white p-8 shadow-lg">
				<div class="mb-8 flex items-center justify-between">
					<div class="flex items-center gap-4">
						<h1 class="text-3xl font-bold text-gray-900">Welcome!</h1>
						<span
							class={`rounded-full border px-3 py-1 text-sm font-semibold ${getProviderBadgeColor($loginStore.provider)}`}
						>
							{$loginStore.provider.charAt(0).toUpperCase() + $loginStore.provider.slice(1)}
						</span>
					</div>
					<button
						on:click={handleLogout}
						class="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
					>
						Logout
					</button>
				</div>

				<div class="space-y-6">
					<div>
						<h2 class="mb-4 text-xl font-semibold text-gray-800">Authentication Information</h2>
					</div>

					{#if $loginStore.userInfo}
						<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<h3 class="mb-2 font-semibold text-blue-900">User Info</h3>
							<div class="space-y-1 text-sm">
								{#if $loginStore.userInfo.name}
									<p><span class="font-medium">Name:</span> {$loginStore.userInfo.name}</p>
								{/if}
								{#if $loginStore.userInfo.email}
									<p><span class="font-medium">Email:</span> {$loginStore.userInfo.email}</p>
								{/if}
								{#if $loginStore.userInfo.preferred_username}
									<p>
										<span class="font-medium">Username:</span>
										{$loginStore.userInfo.preferred_username}
									</p>
								{/if}
								{#if $loginStore.userInfo.picture}
									<div class="mt-3 flex items-center gap-3">
										<span class="font-medium">Avatar:</span>
										<img
											src={$loginStore.userInfo.picture}
											alt="Profile"
											class="h-12 w-12 rounded-full border-2 border-blue-300"
										/>
									</div>
								{/if}
								<p><span class="font-medium">Subject:</span> {$loginStore.userInfo.sub}</p>
							</div>
						</div>
					{/if}

					<div class="rounded-lg border border-green-200 bg-green-50 p-4">
						<h3 class="mb-2 font-semibold text-green-900">Access Token</h3>
						<p class="font-mono text-xs break-all text-gray-700">{$loginStore.accessToken}</p>
					</div>

					{#if $loginStore.refreshToken}
						<div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
							<h3 class="mb-2 font-semibold text-purple-900">Refresh Token</h3>
							<p class="font-mono text-xs break-all text-gray-700">{$loginStore.refreshToken}</p>
						</div>
					{/if}

					{#if $loginStore.idToken}
						<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
							<h3 class="mb-2 font-semibold text-yellow-900">ID Token</h3>
							<p class="font-mono text-xs break-all text-gray-700">{$loginStore.idToken}</p>
						</div>
					{/if}

					{#if $loginStore.expiresAt}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<h3 class="mb-2 font-semibold text-gray-900">Token Expiration</h3>
							<p class="text-sm text-gray-700">
								Expires at: {new Date($loginStore.expiresAt * 1000).toLocaleString()}
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
			<p class="mt-4 text-gray-600">Redirecting to login...</p>
		</div>
	</div>
{/if}
