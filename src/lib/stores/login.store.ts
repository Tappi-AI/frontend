// src/lib/stores/login.store.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type LoginProvider = 'authentik' | 'local';

export interface LoginInfo {
	provider: LoginProvider;
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	expiresAt?: number;
	userInfo?: {
		sub: string;
		email?: string;
		name?: string;
		preferred_username?: string;
		picture?: string;
	};
}

// Load from localStorage if in browser
const getInitialValue = (): LoginInfo | null => {
	if (browser) {
		const stored = localStorage.getItem('loginInfo');
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch (e) {
				console.error('Failed to parse stored login info', e);
			}
		}
	}
	return null;
};

export const loginStore = writable<LoginInfo | null>(getInitialValue());

// Subscribe to store changes and persist to localStorage
if (browser) {
	loginStore.subscribe((value) => {
		if (value) {
			localStorage.setItem('loginInfo', JSON.stringify(value));
		} else {
			localStorage.removeItem('loginInfo');
		}
	});
}

export const logout = () => {
	loginStore.set(null);
	if (browser) {
		localStorage.removeItem('loginInfo');
	}
};
