// src/lib/stores/meetingsStore.ts
import { writable } from 'svelte/store';
import { DateTime } from 'luxon';

export interface Meeting {
	id: string;
	title: string;
	start: DateTime;
	end: DateTime;
	mood?: 'high' | 'low'; // stored in store
}

export const meetingsStore = writable<Meeting[]>([]);

export function addMeeting(meeting: Meeting) {
	meetingsStore.update((meetings) => [...meetings, meeting]);
}

export function updateMeeting(id: string, updated: Partial<Meeting>) {
	meetingsStore.update((meetings) => meetings.map((m) => (m.id === id ? { ...m, ...updated } : m)));
}

export function deleteMeeting(id: string) {
	meetingsStore.update((meetings) => meetings.filter((m) => m.id !== id));
}

export function getMeetingsForDate(date: DateTime) {
	let result: Meeting[] = [];
	meetingsStore.subscribe((meetings) => {
		result = meetings.filter((m) => m.start.hasSame(date, 'day') || m.end.hasSame(date, 'day'));
	})();
	return result;
}
