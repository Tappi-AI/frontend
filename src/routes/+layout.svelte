<!--routes/+layout.svelte-->

<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { authStore, logout } from '$lib/stores/auth.store';

	let { children } = $props();
	let menuOpen = $state(false);

	const handleLogout = () => {
		logout();
		menuOpen = false;
		goto('/login');
	};

	const navigate = (path: string) => {
		menuOpen = false;
		goto(path);
	};
</script>

<svelte:head></svelte:head>

<!-- Floating Menu Button -->
<button
	onclick={() => (menuOpen = !menuOpen)}
	class="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
	aria-label="Toggle menu"
>
	{#if menuOpen}
		<svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	{:else}
		<svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	{/if}
</button>

<!-- Slide-out Menu -->
{#if menuOpen}
	<!-- Backdrop -->
	<button
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
		onclick={() => (menuOpen = false)}
		aria-label="Close menu"
	></button>

	<!-- Menu Panel -->
	<div class="fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-2xl">
		<div class="flex h-full flex-col pt-20">
			<nav class="flex-1 space-y-1 px-4">
				<button
					onclick={() => navigate('/')}
					class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-100"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
					Home
				</button>

				<button
					onclick={() => navigate('/debug')}
					class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-100"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
						/>
					</svg>
					Debug
				</button>

				{#if $authStore?.role}
					<button
						onclick={() => navigate('/chat')}
						class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-100"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
						Chat
					</button>

					<button
						onclick={() => navigate('/calendar')}
						class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-100"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						Calendar
					</button>
				{/if}
			</nav>

			<!-- Bottom Section -->
			<div class="border-t border-gray-200 p-4">
				{#if $authStore?.role}
					{#if $authStore.userInfo}
						<div class="mb-3 flex items-center gap-3 px-2">
							{#if $authStore.userInfo.picture}
								<img src={$authStore.userInfo.picture} alt="Profile" class="h-8 w-8 rounded-full" />
							{:else}
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600"
								>
									{($authStore.userInfo.name || $authStore.userInfo.email || '?')
										.charAt(0)
										.toUpperCase()}
								</div>
							{/if}
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium text-gray-900">
									{$authStore.userInfo.name || $authStore.userInfo.email || 'User'}
								</p>
								<p class="truncate text-xs text-gray-500">
									{$authStore.provider}
									<span
										class={`ml-1 rounded px-1 text-xs ${$authStore.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
									>
										{$authStore.role}
									</span>
								</p>
							</div>
						</div>
					{/if}
					<button
						onclick={handleLogout}
						class="flex w-full items-center gap-3 rounded-lg bg-red-50 px-4 py-3 text-red-700 transition hover:bg-red-100"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						Logout
					</button>
				{:else}
					<button
						onclick={() => navigate('/login')}
						class="flex w-full items-center gap-3 rounded-lg bg-purple-600 px-4 py-3 text-white transition hover:bg-purple-700"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
							/>
						</svg>
						Login
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<main>
	{@render children?.()}
</main>
