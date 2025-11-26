<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { DateTime } from 'luxon';
	import { calendarStore, setCurrentDate, setLayout, LAYOUTS } from '$lib/stores/calendarStore';
	import { monthGrid } from '$lib/stores/derivedCalendar';
	import Meetings from '$lib/components/Meetings.svelte';

	// selectedDate controls the currently clicked day
	let selectedDate = $calendarStore.currentDate; // default: today

	const isSameDate = (a: DateTime, b: DateTime) => a.toISODate() === b.toISODate();
</script>

<!-- ===================== HEADER ===================== -->
<div class="flex items-center gap-2 border-b border-gray-200 p-3">
	<button
		class="rounded px-2 py-1 hover:bg-gray-100"
		on:click={() => setCurrentDate($calendarStore.currentDate.minus({ months: 1 }))}
	>
		‹
	</button>

	<h2 class="m-0 text-lg font-semibold flex items-center gap-1">
		<span class="inline-block text-right w-12">
			{$calendarStore.currentDate.toFormat('MMM')}
		</span>
		<span class="inline-block w-14">
			{$calendarStore.currentDate.toFormat('yyyy')}
		</span>
	</h2>


	<button
		class="rounded px-2 py-1 hover:bg-gray-100"
		on:click={() => setCurrentDate($calendarStore.currentDate.plus({ months: 1 }))}
	>
		›
	</button>
		<button
		class="ml-2 rounded bg-blue-300 px-3 py-1 text-white hover:bg-blue-400"
		on:click={() => {
			const today = DateTime.now();
			setCurrentDate(today);
			selectedDate = today;
		}}
	>
		Today
	</button>
</div>

<!-- ===================== WEEKDAY HEADER ===================== -->
<div class="grid grid-cols-7 text-center font-semibold border-b border-gray-300 bg-gray-100">
	<div>Sun</div>
	<div>Mon</div>
	<div>Tue</div>
	<div>Wed</div>
	<div>Thu</div>
	<div>Fri</div>
	<div>Sat</div>
</div>

<!-- ===================== MONTH GRID ===================== -->
<div class="grid h-[calc(100vh-120px)] grid-cols-7 grid-rows-6 border-t border-l border-gray-300">
	{#each $monthGrid as cell}
		<div
			class={`relative cursor-pointer border-r border-b border-gray-300 p-1 select-none
				${cell.inCurrentMonth ? '' : 'bg-gray-50 text-gray-400'}
				${cell.isToday ? 'z-10 border-2 border-blue-500 bg-blue-100' : ''}
				${isSameDate(cell.date, selectedDate) ? 'z-20 bg-blue-50 outline-2 outline-blue-600' : ''}`}
			role="button"
			tabindex="0"
			on:click={() => (selectedDate = cell.date)}
			on:keydown={(e) => e.key === 'Enter' && (selectedDate = cell.date)}
		>
			<span class="absolute top-1 right-1 text-xs font-semibold">{cell.date.day}</span>

			<!-- Always render meetings for this cell's date -->
			<Meetings date={cell.date} />
		</div>
	{/each}
</div>
