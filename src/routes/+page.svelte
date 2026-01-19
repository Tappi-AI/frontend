<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore, logout } from '$lib/stores/auth.store';

	onMount(() => {
		if (!$authStore) {
			goto('/login');
		}
	});

	const handleLogout = () => {
		logout();
		goto('/login');
	};

	const providerBadge = (provider: string) =>
		({
			authentik: 'bg-blue-100 text-blue-800 border-blue-200',
			google: 'bg-red-100 text-red-800 border-red-200',
			microsoft: 'bg-green-100 text-green-800 border-green-200'
		})[provider] ?? 'bg-gray-100 text-gray-800 border-gray-200';
</script>

{#if $authStore}
	<div class="min-h-screen bg-gray-50 p-8">
		<div class="mx-auto max-w-4xl">
			<div class="rounded-lg bg-white p-8 shadow-lg">
				<div class="mb-8 flex items-center justify-between">
					<div class="flex items-center gap-4">
						<h1 class="text-3xl font-bold">Welcome</h1>
						<span
							class={`rounded-full border px-3 py-1 text-sm font-semibold ${providerBadge($authStore.provider)}`}
						>
							{$authStore.provider}
						</span>
					</div>
					<button
						on:click={handleLogout}
						class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>
						Logout
					</button>
				</div>

				{#if $authStore.userInfo}
					<div class="mb-6 rounded-lg border bg-blue-50 p-4">
						<h3 class="mb-2 font-semibold">User Info</h3>
						<p><strong>Name:</strong> {$authStore.userInfo.name}</p>
						<p><strong>Email:</strong> {$authStore.userInfo.email}</p>
						<p><strong>Subject:</strong> {$authStore.userInfo.sub}</p>

						{#if $authStore.userInfo.picture}
							<img
								src={$authStore.userInfo.picture}
								alt="Avatar"
								class="mt-3 h-16 w-16 rounded-full border"
							/>
						{/if}
					</div>
				{/if}

				<div class="space-y-4">
					<div class="rounded border bg-gray-50 p-3">
						<strong>Access Token</strong>
						<p class="font-mono text-xs break-all">
							{$authStore.accessToken}
						</p>
					</div>

					{#if $authStore.refreshToken}
						<div class="rounded border bg-gray-50 p-3">
							<strong>Refresh Token</strong>
							<p class="font-mono text-xs break-all">
								{$authStore.refreshToken}
							</p>
						</div>
					{/if}

					{#if $authStore.expiresAt}
						<div class="text-sm text-gray-600">
							Expires at:
							{new Date($authStore.expiresAt * 1000).toLocaleString()}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="h-12 w-12 animate-spin rounded-full border-b-4 border-blue-600"></div>
	</div>
{/if}
