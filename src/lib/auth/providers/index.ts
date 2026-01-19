// lib/auth/providers/index.ts

import { authentikProvider } from './authentik';
// later: googleProvider, microsoftProvider

export const providers = {
	authentik: authentikProvider
};
