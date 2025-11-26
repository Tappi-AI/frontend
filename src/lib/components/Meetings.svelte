<!-- src/lib/components/Meetings.svelte -->
<script lang="ts">
	import { DateTime } from 'luxon';
	import type { Meeting } from '$lib/stores/meetingsStore';
	import {
		meetingsStore,
		addMeeting,
		updateMeeting,
		deleteMeeting
	} from '$lib/stores/meetingsStore';
	import { writable, derived } from 'svelte/store';

	export let date: DateTime;

	// Derived store to reactively filter meetings for the selected date
	const meetingsForDate = derived(meetingsStore, ($meetingsStore) =>
		$meetingsStore.filter((meet) => meet.start.hasSame(date, 'day'))
	);

	let meetings: Meeting[] = [];
	meetingsForDate.subscribe((m) => (meetings = m));

	const showModal = writable(false);
	let editingMeeting: Meeting | null = null;

	let title = '';
	let startTime = date.toFormat('HH:mm');
	let endTime = date.plus({ hours: 1 }).toFormat('HH:mm');
	let mood: 'high' | 'low' = 'high'; // stored in store
	let color = '#3b82f6'; // temporary only, theme managed in future

	function openModal(meeting?: Meeting) {
		if (meeting) {
			editingMeeting = meeting;
			title = meeting.title;
			startTime = meeting.start.toFormat('HH:mm');
			endTime = meeting.end.toFormat('HH:mm');
			mood = meeting.mood ?? 'high';
			color = '#3b82f6'; // temporary
		} else {
			editingMeeting = null;
			title = '';
			startTime = date.toFormat('HH:mm');
			endTime = date.plus({ hours: 1 }).toFormat('HH:mm');
			mood = 'high';
			color = '#3b82f6';
		}
		showModal.set(true);
	}

	function saveMeeting() {
		const start = DateTime.fromFormat(`${date.toISODate()} ${startTime}`, 'yyyy-MM-dd HH:mm');
		const end = DateTime.fromFormat(`${date.toISODate()} ${endTime}`, 'yyyy-MM-dd HH:mm');

		if (editingMeeting) {
			updateMeeting(editingMeeting.id, { title, start, end, mood });
		} else {
			addMeeting({ id: crypto.randomUUID(), title, start, end, mood });
		}

		showModal.set(false);
	}

	function removeMeeting(id: string) {
		deleteMeeting(id);
		showModal.set(false);
	}
</script>

<div class="mt-5 flex flex-col gap-1">
	{#each meetings as meet (meet.id)}
		<button
			type="button"
			class="cursor-pointer rounded p-1 text-left text-xs text-white"
			style="background-color: {color}"
			onclick={() => openModal(meet)}
		>
			{meet.title} ({meet.start.toFormat('HH:mm')}) [{meet.mood}]
		</button>
	{/each}

	<button
		type="button"
		class="mt-1 text-xs text-blue-600 hover:underline"
		onclick={() => openModal()}
	>
		+ Add
	</button>
</div>

{#if $showModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="w-80 rounded bg-white p-4">
			<h3 class="mb-2 font-semibold">{editingMeeting ? 'Edit Meeting' : 'New Meeting'}</h3>

			<label for="title" class="mb-1 block text-sm">Title</label>
			<input id="title" type="text" bind:value={title} class="mb-2 w-full rounded border p-1" />

			<label for="startTime" class="mb-1 block text-sm">Start Time</label>
			<input
				id="startTime"
				type="time"
				bind:value={startTime}
				class="mb-2 w-full rounded border p-1"
			/>

			<label for="endTime" class="mb-1 block text-sm">End Time</label>
			<input id="endTime" type="time" bind:value={endTime} class="mb-2 w-full rounded border p-1" />

			<label for="mood" class="mb-1 block text-sm">Mood</label>
			<select id="mood" bind:value={mood} class="mb-2 w-full rounded border p-1">
				<option value="high">High</option>
				<option value="low">Low</option>
			</select>

			<label for="color" class="mb-1 block text-sm">Color (temporary)</label>
			<input id="color" type="color" bind:value={color} class="mb-4 w-full rounded border p-1" />

			<div class="flex justify-end gap-2">
				{#if editingMeeting}
					<button
						type="button"
						class="rounded bg-red-500 px-2 py-1 text-white"
						onclick={() => removeMeeting(editingMeeting!.id)}>Delete</button
					>
				{/if}
				<button
					type="button"
					class="rounded bg-gray-200 px-2 py-1"
					onclick={() => showModal.set(false)}>Cancel</button
				>
				<button type="button" class="rounded bg-blue-600 px-2 py-1 text-white" onclick={saveMeeting}
					>Save</button
				>
			</div>
		</div>
	</div>
{/if}
