<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.store';
	import { startLogin } from '$lib/auth/auth.service';

	onMount(() => {
		if ($authStore) {
			goto('/');
		}
	});
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h1>
			<p class="text-gray-600">Sign in to continue</p>
		</div>

		<div class="space-y-4">
			<button
				on:click={() => startLogin('authentik')}
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
			>
				Login with Authentik
			</button>

			<!-- future providers -->
			<!--
      <button on:click={() => startLogin('google')}>Login with Google</button>
      <button on:click={() => startLogin('microsoft')}>Login with Microsoft</button>
      -->
		</div>
	</div>
</div>
