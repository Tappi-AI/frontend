// lib/stores/profile.store.ts

import { writable } from 'svelte/store';
import type { Json } from '../types/json';

export type User = {
	usr_id: string;
	persona: Json;
} | null;

export const userStore = writable<User>(null);
